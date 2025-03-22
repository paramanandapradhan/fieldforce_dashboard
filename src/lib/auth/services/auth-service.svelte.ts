import { goto } from '$app/navigation';
import { firebaseApp } from '$lib/firebase/firebase-service';
import type { OrgDataModel } from '$lib/org/org-types';
import { getUserCache, updateUser } from '$lib/user/user-service';
import type { ClaimUsers, UserDataModel } from '$lib/user/user-types';
import {
	delay,
	openAlertDialog,
	openConfirmDialog,
	openImagePickerDialogWithCropper,
	openLoadingDialog,
	openTextFieldDialog,
	showSuccessToast,
	showToast
} from '@cloudparker/moldex.js';
import type { User as FirebaseAuthUserType } from 'firebase/auth';
import {
	browserLocalPersistence,
	getAuth,
	sendEmailVerification,
	signInWithCustomToken,
	updateProfile
} from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';
import {
	APP_LANDING_PAGE_PATH,
	APP_LOGIN_PAGE_PATH,
	IS_DEV_ENV
} from '../../core/services/app-environment-service';
import { getRedirectUrl, } from '../../core/services/app-utils-service';
import { FirebaseAuthStatesEnum, type FirebaseAuthClaimsType } from '../auth-types';
import { AUTH_COMMAND_ANONYMOUS_TOKEN, AUTH_COMMAND_SWITCH_USER } from './auth-command-service';
import { getAuthErrorMessage } from './auth-errors-service';
import { getOrgCache } from '$lib/org/org-service';
import { clearLocalDatabase } from '$lib/database/local-database-service';
import { uploadFile } from '$lib/file/file-service';
import { clearFcmToken } from '$lib/firebase/fcm-service';
import { DatabaseService } from '$lib/database/database-service';
import { get, writable } from 'svelte/store';
import { authState } from './auth-state.svelte';

let firebaseAuthStateTimeout: NodeJS.Timeout | null;

const KEY_ANOYMOUS_UID = 'key.anonymous.uid';
const KEY_ANOYMOUS_NAME = 'key.anonymous.name';


export function initFirebaseAuth() {
	if (firebaseApp) {
		getAuth(firebaseApp)
			.setPersistence(browserLocalPersistence)
			.then(() => {
				if (IS_DEV_ENV) {
					console.log('Local auth anabled');
				}
			})
			.catch((error) => {
				console.error(error);
			});

		// refreshClaim(false);

		getAuth(firebaseApp).onAuthStateChanged(
			(firebaseUser: FirebaseAuthUserType | null) => {
				// Avaid multiple call of auth function
				console.log(firebaseUser);
				if (firebaseAuthStateTimeout) clearTimeout(firebaseAuthStateTimeout);
				firebaseAuthStateTimeout = setTimeout(async () => {
					firebaseAuthStateTimeout = null;
					let redirect = getRedirectUrl();
					if (firebaseUser) {
						console.log('Loged in firebaseUser ', firebaseUser);
						console.log(firebaseUser);

						authState.firebaseAuthUser = firebaseUser;

						authState.firebaseAuthState = FirebaseAuthStatesEnum.SIGNIN;

						// initializeFcm();

						let pathname = window.location.pathname;

						if (pathname != (redirect || APP_LANDING_PAGE_PATH)) {
							console.log('Redirect Url is present', redirect);
							goto(redirect || APP_LANDING_PAGE_PATH, { replaceState: true });
						}

						// console.log('Auth Phone', user.phoneNumber);
						// console.log('Auth Email', user.email);

						refreshClaim(true);
					} else {
						console.log('Auth user not found!', firebaseUser);
						authState.firebaseAuthUser = null;
						authState.firebaseAuthState = FirebaseAuthStatesEnum.SIGNOUT;
						if (redirect == '/profile') {
							redirect = APP_LANDING_PAGE_PATH;
						}
						goto(`${APP_LOGIN_PAGE_PATH}?redirect=${redirect || '/'}`, { replaceState: true });
						// anonymousLogin();
					}
				}, 300);
			},
			(error: Error) => {
				console.error('Error on auth state change listener', error);
			}
		);

		if (IS_DEV_ENV) {
			console.log('Firebase Auth initialized!')
		}
	}
}

export async function signout() {
	// Clear fcm
	clearFcmToken();

	await getAuth().signOut();

	clearLocalDatabase();

	DatabaseService.clearCache();

	// PWA window close
	window.close();

	goto(APP_LANDING_PAGE_PATH);
}

/**
 * Refresh claims with delay of 15 secs.
 * There may be a chance of delay on update claims by functions after user/auth/identity/role updates
 */
export async function refreshClaimDelay(millis: number = 1000, forceRefresh: boolean = false) {
	await delay(millis);
	return await refreshClaim(forceRefresh);
}

export async function refreshClaim(forceRefresh?: boolean) {
	console.log('RefreshClaim called');
	let claims = await getFirebaseAuthIdTokenClaims(forceRefresh);
	if (IS_DEV_ENV) {
		console.log('Claims', claims);
	}
	if (claims) {
		await extractClaimsInfo(claims);
		if (claims?.oid && claims.ouid && claims.rid && claims?.scp) {
			console.log('Auth org user available!');
		} else {
			console.log('Auth org user NOT available!');
			// Auth user not defined in the claim,
			// Nominate a user for auth and add the credentials in claims.
			// Later user can swich to other usr by UI.
			await ensureAuthUser(claims);
		}
	}
}

export async function ensureAuthUser(claims: FirebaseAuthClaimsType) {
	let users = await extractOrgUsers(claims);
	console.log('ensureAuthUser users ', users);
	if (IS_DEV_ENV && !users?.length) {
		console.log('No org/users found for this auth claims! May be new org registration required!');
	}
	if (users?.length) {
		let user = users[0];
		if (user) {
			await switchAuthUser(user);
		}
	}
}

export async function extractOrgUsers(claims: FirebaseAuthClaimsType) {
	if (claims?.orgs) {
		let orgsMap = claims.orgs || {};
		let userList: ClaimUsers[] = [];
		Object.keys(orgsMap).map((oid: string) => {
			let usersMap = orgsMap[oid] || {};
			Object.keys(usersMap).map((uid) => {
				let rid = usersMap[uid];
				userList.push({ _id: uid, oid: oid, rid: rid });
			});
		});
		return userList;
	}
	return [];
}

export async function extractClaimsInfo(claims: FirebaseAuthClaimsType) {
	if (claims) {
		authState.authOrg = await extractAuthOrg(claims);
		authState.authOrgUser = await extractAuthOrgUser(claims);
		authState.authOrgUsers = await extractOrgUsers(claims);

		authState.isRootUser = !!claims.ur;
		authState.isSupportUser = !!claims.us;
		authState.isAdminUser = claims.rid == '1';

		// Check all all basic user infromation required before start
		if (claims && claims.email && !claims.email_verified) {
			authState.isEmailVerificationRequired = true;
		} else {
			authState.isEmailVerificationRequired = false;
		}

		if (!getFirebaseAuthUserName(claims)) {
			authState.isUserNameRequired = true;
		} else {
			authState.isUserNameRequired = false;
		}

		if (!getAuthOrgUsers()?.length) {
			authState.isNewOrganizationRequired = true;
		} else {
			authState.isNewOrganizationRequired = false;
		}

		authState.firebaseAuthClaims = claims;

		return claims;
	}
}

export async function switchAuthUser(user: ClaimUsers) {
	if (IS_DEV_ENV) {
		console.log('Switch user', user);
	}
	await authoriseAuthUser(user);
	await refreshClaim(true);
	return user;
}

export async function authoriseAuthUser(user: UserDataModel) {
	let fuid = getFirebaseAuthUid();
	if (user) {
		// console.log('authoriseAuthUser', user._id)
		const appAuthCommands = httpsCallable(getFunctions(), 'appAuthCommands');
		try {
			let payload = { fuid, oid: user.oid, uid: user._id, rid: user.rid };
			console.log('appAuthCommands', AUTH_COMMAND_SWITCH_USER, payload);
			let res: any = await appAuthCommands({
				command: AUTH_COMMAND_SWITCH_USER,
				payload
			});
			console.log('authoriseAuthUser response', res);
			if (res.data.data) {
				return res.data.data;
			} else {
				return null;
			}
		} catch (error) {
			console.error(error);
		}
	}
}


export function getFirebaseAuthUser() {
	return authState.firebaseAuthUser;
}

export function getFirebaseAuthClaims() {
	return authState.firebaseAuthClaims
}

export function getFirebaseAuthUserPhoneNumber(): string | null {
	return getFirebaseAuthClaims()?.phone || getFirebaseAuthUser()?.phoneNumber || '';
}

export function getFirebaseAuthUserEmail(): string | null {
	return getFirebaseAuthClaims()?.email || getFirebaseAuthUser()?.email || '';
}

export function getFirebaseAuthUid(): string | null {
	return getFirebaseAuthClaims()?.user_id || getFirebaseAuthUser()?.uid || '';
}

export function getAuthOrgUsers(): ClaimUsers[] | null {
	return authState.authOrgUsers;
}

export function getAuthUser(): UserDataModel | null {
	return authState.authOrgUser;
}


export function getAuthOrgUser() {
	return authState.authOrgUser;
}

export function getAuthOrgUserId(): string | undefined {
	return getAuthOrgUser()?._id;
}

export function getAuthOrgUserName(): string | undefined {
	return getAuthOrgUser()?.name;
}

export function getAuthOrgId(): string | undefined {
	return getAuthOrg()?._id;
}

export function getAuthOrg(): OrgDataModel | null {
	return authState.authOrg;
}

export async function extractAuthOrgUser(claims: FirebaseAuthClaimsType) {
	if (claims && claims.oid && claims.ouid) {
		let user = await getUserCache(claims.ouid);
		if (user) {
			return user;
		} else {
			console.error('Cache user not found', user);
		}
	}
	return null;
}

export async function extractAuthOrg(claims: FirebaseAuthClaimsType) {
	if (claims && claims.oid) {
		let org = await getOrgCache(claims.oid);
		if (org) {
			return org;
		} else {
			console.error('Cache org not found', org);
		}
	}
	return null;
}

export async function getFirebaseAuthIdTokenClaims(forceRefresh: boolean = false) {
	if (getFirebaseAuthUser()) {
		let result = await getFirebaseAuthUser()?.getIdTokenResult(forceRefresh);
		let claims = result?.claims as FirebaseAuthClaimsType;
		return claims;
	}
}

export async function getToken(forceRefresh?: boolean) {
	if (getAuth()?.currentUser) {
		return await getAuth().currentUser?.getIdToken(forceRefresh);
	}
}

export function getFirebaseAuthUserName(claims?: FirebaseAuthClaimsType | null): string {
	let myClaims = claims || getFirebaseAuthClaims();
	if (myClaims) {
		return myClaims.name || myClaims.displayName || '';
	}
	return '';
}

export async function ensureFirebaseAuthUserClaims() {
	if (!getFirebaseAuthClaims()) {
		goto(`${APP_LOGIN_PAGE_PATH}?redirect=` + getRedirectUrl());
		return false;
	} else {
		return true;
	}
}

export async function ensureFirebaseAuthUserName() {
	if (getFirebaseAuthUser()) {
		let result = await getFirebaseAuthUser()?.getIdTokenResult(true);
		let claims = result?.claims;
		if (claims) {
			authState.firebaseAuthClaims = claims;
			if (claims._id) {
				if (!claims.name) {
					goto('/profile/name?redirect=' + getRedirectUrl());
					return false;
				}
				return true;
			}
		}
		return false;
	}
}

export async function invalidateAuthOrg() {
	if (getAuthOrgUser()) {
		let org = (await getOrgCache(getAuthOrgUser()!.oid)) || undefined;
		if (org) {
			authState.authOrg = org;
		}
		return org;
	}
}

export async function updateFirebaseAuthUserName(name: string) {
	const auth = getAuth();
	if (auth.currentUser) {
		await updateProfile(auth.currentUser, {
			displayName: name
		});
	}
}

export async function anonymousLogin(displayName?: string) {
	let fuid = localStorage.getItem(KEY_ANOYMOUS_UID);
	let name = displayName || localStorage.getItem(KEY_ANOYMOUS_NAME);
	if (!fuid) fuid = `anonymous:${crypto.randomUUID()}`;
	if (!name) name = `Anonymous`;
	localStorage.setItem(KEY_ANOYMOUS_UID, fuid);
	localStorage.setItem(KEY_ANOYMOUS_NAME, name);

	const authCommands = httpsCallable(getFunctions(), 'authCommands');
	try {
		let value: any = await authCommands({
			command: AUTH_COMMAND_ANONYMOUS_TOKEN,
			payload: { fuid, displayName: name }
		});
		console.log(value);
		let token = value.data.token;
		if (token) {
			await signInWithCustomToken(getAuth(), token);
			authState.firebaseAuthUser = getAuth().currentUser;
			await refreshClaim(true);
		}
	} catch (error) {
		console.error(error);
	}
}

export async function ensureAnonymousFirebaseAuthUserName() {
	let displayName = getFirebaseAuthUserName(getFirebaseAuthClaims());
	if (displayName == 'Anonymous') {
		let data: any = await openTextFieldDialog({
			title: 'User name',
			label: 'Your name',
			name: 'name',
			maxlength: 80
		});
		if (data && data.name) {
			let loading = await openLoadingDialog({ msg: 'Creating user...' });
			await anonymousLogin(data.name);
			loading.closeDialog();
		}
	}

	displayName = getFirebaseAuthUserName(getFirebaseAuthClaims());

	if (displayName != 'Anonymous') {
		return true;
	} else {
		return false;
	}
}

export async function resendEmailVerification() {
	let currentUser = getAuth().currentUser;
	if (currentUser && currentUser.email && !currentUser.emailVerified) {
		if (
			await openConfirmDialog({
				title: 'Resend Email',
				msg: `Would you like to resend an email verification message to '<b>${currentUser.email}</b>'?`,
				footerOkButtonLable: 'Resend now'
			})
		) {
			return sendEmailVerification(currentUser)
				.then(async () => {
					await openAlertDialog({
						title: 'Resend Success',
						msg: `An email verification message has been sent to '<b>${currentUser?.email}</b>'. Please click on the verification link provided in the message. If you haven't received it in your inbox, please check your junk or spam folder.`
					});
				})
				.catch((error) => {
					console.error(error);
					let msg = getAuthErrorMessage(error.code || '');
					showToast({ msg: msg });
				});
		}
	}
}

export async function checkEmailVerified() {
	await refreshClaim(true);
	return authState.isEmailVerificationRequired;
}

export async function showSignoutUI() {
	if (
		await openConfirmDialog({
			title: 'Logout',
			footerOkButtonLable: 'Logout',
			footerOkButtonClassName: 'bg-red-600'
		})
	) {
		await signout();
		return true;
	}
}

export async function showfirebaseAuthUserChangeNameUI() {
	if (!getAuthOrgUser()?._id) {
		return showToast({ msg: "Can'not update name now." });
	}
	let orgUser: UserDataModel = getAuthOrgUser() || {};

	let name = orgUser.name || '';

	let data: any = await openTextFieldDialog({
		title: 'Change name',
		footerOkButtonLable: 'Update',
		name: 'name',
		label: 'User name',
		value: name,
		maxlength: 50,
		required: true,
		autofocus: true
	});
	name = ((data || {}).name || '').trim();

	if (name) {
		let loading = await openLoadingDialog();
		try {
			await updateUser(orgUser._id!, { name });
			await getUserCache(orgUser._id!);
			await await refreshClaim(true);
			showSuccessToast();
		} catch (error: any) {
			showToast({ msg: error.message });
		}
		loading.closeDialog();
	}
}

export async function showfirebaseAuthUserChangePhotoUI() {
	let file = await openImagePickerDialogWithCropper({
		outputWidth: 480,
		outputQuality: 0.6,
		outputAspectRatio: 1
	});
	if (file) {
		let loadingRef = await openLoadingDialog({ msg: 'Uploading image...' });
		try {
			if (getAuthOrgUser()) {
				let userId = getAuthOrgUser()?._id;
				if (userId && file) {
					let fid = await uploadFile({
						file,
						collection: 'users',
						field: 'photo',
						docId: userId
					});
					if (fid) {
						await updateUser(userId, { photo: fid });
					}
				}
				return true;
			}
		} catch (e: any) {
			console.error(e);
			showToast({ msg: e.message });
		} finally {
			loadingRef.closeDialog();
		}
	}
	return false;
}


