import { getAuth, type UserRecord } from "firebase-admin/auth";
import { identity, isEmpty, pickBy } from "lodash";
import * as  shortid from "shortid";
import { UserIdentityDataModel, UserDataModel } from "../types/types";
import { findUsersByEmailUid, findUsersByPhoneUid, getUser } from "./user.service";
import { generateRandomPassword } from "../utils/utils";
import { getRole } from "./role.service";
import { ADMIN_ROLE_ID, ROOT_ORG_ID, SERVICE_ROLE_ID, SERVICE_USER_ID } from "./common.service";
import axios from "axios";




export const updateAuthUserRoleAccessClaims = async ({ fuid, oid, uid, rid }: { fuid: string, oid: string, uid: string, rid: string }) => {
    console.log(`----------------${fuid} : updateAuthUserRoleAccessClaims Start---------------`, { fuid, oid, uid, rid })
    if (fuid) {
        try {
            let authUser = await getAuthUserByUid({ fuid }) || {};
            let customClaims: any = authUser.customClaims;
            let payload: any = {};

            // Sample Json : { orgs: { "oid" : "rid" } }
            let claimRoleId = ((customClaims.orgs || {})[oid] || {})[uid];

            if (rid != claimRoleId) {
                console.log('requested role id (rid)', rid);
                console.log('Allowed claimRoleId', claimRoleId);
                console.log('There might be some issue in user sync in client side, No problem, I am reseting the role to correct one.')
            }

            if (claimRoleId == ADMIN_ROLE_ID) {
                console.log('User has andmin access!');
                payload.scp = {};
            } else {
                let role = await getRole({ oid, rid: claimRoleId });
                if (role) {
                    payload.scp = role.scp || {};
                } else {
                    console.log('Role not found with the id ', claimRoleId);
                    payload.scp = {};
                }
            }

            payload.oid = oid;
            payload.ouid = uid;
            payload.rid = claimRoleId;

            // Add super admin claims
            if (oid == ROOT_ORG_ID && uid) {
                let orgUser = await getUser({ oid, uid });
                if (orgUser) {
                    if (orgUser.ur) payload.ur = true;
                    if (orgUser.us) payload.us = true;
                }
            }
            if (!payload.ur) payload.ur = false;
            if (!payload.us) payload.us = false;


            await updateAuthUserClaims({ fuid, payload });
            console.log('Update auth user claims with access  : ', fuid, payload);
            return true;
        } catch (error) {
            console.error(error);
        }
    }
    console.log(`----------------${fuid} : updateAuthUserRoleAccessClaims End---------------`)
    return false;
}

export const updateAuthUserClaims = async ({ fuid, payload = {} }: { fuid: string, payload: any }) => {
    if (fuid) {
        try {
            console.log('updateAuthUserClaims called with fuid :', fuid);
            let authUser = await getAuthUserByUid({ fuid }) || {};
            let claims: any = {
                ...authUser.customClaims, ...payload
            };

            console.log('updateAuthUserClaims :', fuid, claims)

            await getAuth().setCustomUserClaims(fuid, claims);

            console.log('Update auth user claims success  : ', fuid, JSON.stringify(claims));
        } catch (error) {
            console.log('Error on updateAuthUserClaims ');
            console.error(error);
        }
    }
}

/**
 * Create Service Account User ID Token
 * @param oid Organization ID
 * @returns ID Token
 */
export async function createOrgServiceAccountIdToken(oid: string): Promise<string | undefined> {
    const FIREBASE_API_KEY = process.env.VITE_FIREBASE_API_KEY;
    // Retrieve the service account user
    let serviceAccountUser = await getAuthUserByEmail({ email: getServiceAccountEmail(oid) }); // e.g., service-account-<orgid>@hellocall.ai
    if (serviceAccountUser) {
        // Custom claims for the user
        const customClaims = {
            fuid: serviceAccountUser.uid,
            email: serviceAccountUser.email,
            displayName: serviceAccountUser.displayName,
            oid: oid,
            rid: SERVICE_ROLE_ID,
            _id: SERVICE_USER_ID,
        };

        // Create a custom token
        let { token: customToken } = await createUserCustomToken(customClaims);

        // Exchange the custom token for an ID token using Firebase Authentication REST API
        try {
            const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${FIREBASE_API_KEY}`;
            const response = await axios.post(url, {
                token: customToken,
                returnSecureToken: true,
            });

            // Extract and return the ID token
            return response.data.idToken;
        } catch (error: any) {
            console.error("Error exchanging custom token for ID token:", error.response?.data || error.message);
        }
    }

    return undefined;
}

/**
 * Create User Token
 * @param user user
 * @returns 
 */
export const createUserCustomToken = async (user: UserIdentityDataModel): Promise<{ token: any }> => {
    try {
        const customClaims = {
            displayName: user.displayName,
            email: user.email,
            oid: user.oid,
            rid: user.rid,
            ouid: user._id,
        };
        let token = await getAuth()
            .createCustomToken(user.fuid!, customClaims);
        console.log('User token created : ', user.email, token);
        return { token };
    } catch (error) {
        console.error('Error on create custom token :', error);
        console.error(error);
    }
    console.log('User token create failed!');
    return { token: null };
}

export const createAnonymousToken = async (payload: UserIdentityDataModel): Promise<{ token: any }> => {
    try {
        let token = await getAuth()
            .createCustomToken(payload.uid!, { displayName: payload.displayName, isAnonymous: true });
        console.log('Anonymous token created', !!token);
        return { token };
    } catch (error) {
        console.error('Error on crate custom token :', error);
        console.error(error);
    }
    console.log('Anonymous token create failed!');
    return { token: null };
}

export const updateAuthUser = async ({ uid, payload }: { uid: string, payload: { photoURL?: string, displayName?: string } }): Promise<UserRecord | null> => {
    try {
        let userRecord = await getAuth().updateUser(uid, payload);
        console.log('updateAuthUser success');
        return userRecord;
    } catch (error) {
        console.error(error);
    }
    return null;
}


export const getAuthUserUidsMapByPhoneNumbers = async ({ phoneNumbers = [] }: { phoneNumbers: string[] }): Promise<{ phoneNumber: string, fuid: string }[]> => {
    const array: ({ phoneNumber: string, fuid: string } | null)[] = await Promise.all(phoneNumbers.map(async (key: string) => {
        let phoneNumber = key;
        const user = await getOrCreateAuthUserByPhone({ phoneNumber });
        if (user) {
            const fuid = user.uid;
            if (fuid) {
                return { phoneNumber, fuid };
            }
        }
        return null;
    }));

    return array.filter((o: any) => o) as { phoneNumber: string, fuid: string }[];
}

export const getOrCreateAuthUserUidsByPhoneNumbers = async ({ phoneNumbers = [] }: { phoneNumbers?: string[] }) => {
    if (phoneNumbers) {
        try {
            return Promise.all(phoneNumbers.map(async (phoneNumber: string) => {
                return await (await getOrCreateAuthUserByPhone({ phoneNumber }))?.uid;
            }));
        } catch (error) {
            console.error('Error', error)
        }
    }
    console.error('No fuid found based on phone numbers', phoneNumbers)
    return [];
}

export const getAuthUserByUid = async ({ fuid }: { fuid: string }) => {
    return await getAuth().getUser(fuid);
}

export const getAuthUserByPhoneNumber = async ({ phoneNumber }: { phoneNumber: string }) => {
    return await getAuth().getUserByPhoneNumber('' + phoneNumber);
}

export const getOrCreateAuthUserByPhone = async ({ phoneNumber }: { phoneNumber: string }) => {
    if (phoneNumber) {
        return await getAuth().getUserByPhoneNumber('' + phoneNumber)
            .catch((error: any) => {
                // console.error(error);
                if (error.code == 'auth/user-not-found') {
                    console.log('No auth user found, now creating auth user using phonenumber...');
                    return createAuthUser({ phoneNumber })
                }
                return null;
            });
    }
    return null;

}

export const getAuthUserByEmail = async ({ email }: { email: string }) => {
    if (email) {
        return await getAuth().getUserByEmail(email);
    }
    return null;
}

export const getOrCreateAuthUserByEmail = async ({ email, password = generateRandomPassword() }: { email: string, password?: string }) => {
    if (email) {
        return await getAuth().getUserByEmail(email)
            .catch((error: any) => {
                // console.error(error);
                if (error.code == 'auth/user-not-found') {
                    console.log('No auth user found, now creating auth user using email...');
                    return createAuthUser({ email, password })
                }
                return null;
            });
    }
    return null;
}

export const createAuthUser = async ({ phoneNumber, email, displayName, password }: { phoneNumber?: string, email?: string, displayName?: string, password?: string }) => {
    const payload = pickBy({ phoneNumber, email, displayName, password }, identity);
    if (!isEmpty(payload)) {
        if (payload.email && !payload.password) payload.password = shortid.generate();
        if (payload.phoneNumber || payload.email) {
            return getAuth().createUser({ ...payload });
        }
    }
    return null;
}

export async function updateAuthClaimByEmailUid(_emailUid: string | null) {
    console.log('updateAuthClaimByEmailUid', _emailUid)
    if (_emailUid) {
        let emailUsers = await findUsersByEmailUid(_emailUid!);
        let orgs = emailUsers.reduce((acc, user: UserDataModel) => {
            if (!acc[user.oid!]) acc[user.oid!] = {};
            acc[user.oid!][user._id!] = user.rid || '0';
            return acc;
        }, {} as any)
        console.log('updateAuthClaimByEmailUid orgs', orgs)
        await updateAuthUserClaims({ fuid: _emailUid, payload: { orgs } })
    }
}

export async function updateAuthClaimByPhoneUid(_phoneUid: string | null) {
    console.log('updateAuthClaimByPhoneUid', _phoneUid)
    if (_phoneUid) {
        let phoneUsers = await findUsersByPhoneUid(_phoneUid!);
        let orgs = phoneUsers.reduce((acc, user: UserDataModel) => {
            if (!acc[user.oid!]) acc[user.oid!] = {};
            acc[user.oid!][user._id!] = user.rid || '0';
            return acc;
        }, {} as any)
        await updateAuthUserClaims({ fuid: _phoneUid, payload: { orgs } })
    }
}

export async function getAuthClaims(fuid: string) {
    try {
        const userRecord = await getAuth().getUser(fuid);
        const claims = userRecord.customClaims;
        return claims;
    } catch (error) {
        console.log("Error fetching user and claims :", error);
    }
    return null;
}

export function getServiceAccountEmail(oid: string) {
    return `service-account-${oid}@hellocall.ai`
}

export function getSupportAccountEmail(oid: string) {
    return `support-account-${oid}@hellocall.ai`
}