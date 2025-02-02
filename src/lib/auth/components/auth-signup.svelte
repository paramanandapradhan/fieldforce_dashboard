<script lang="ts">
	import { goto } from '$app/navigation';
	import {
		createUserWithEmailAndPassword,
		getAuth,
		sendEmailVerification,
		updateProfile
	} from 'firebase/auth';

	import {
		Button,
		EmailField,
		PasswordField,
		PhoneField,
		showToast,
		TextField
	} from '@cloudparker/moldex.js';
	import { getAuthErrorMessage } from '../services/auth-errors-service';
	import AuthGotoLogin from './auth-goto-login.svelte';
	import SigninPrivacyTermConsent from './auth-privacy-term-consent.svelte';

	type PropsType = {
		title: string;
	};

	let { title = 'Create a new account' } = $props();

	let isSubmited: boolean = $state(false);
	let name: string = $state('');
	let phone: string = $state('');
	let email: string = $state('');
	let password: string = $state('');
	let confirmPassword: string = $state('');
	let redirect: string = $state('');

	async function handleSubmit(ev: SubmitEvent) {
		ev.preventDefault();
		console.log({ name, phone, email, password, confirmPassword });
		if (!isSubmited) {
			isSubmited = true;

			if (name && email && password && password == confirmPassword) {
				const auth = getAuth();
				try {
					const userCredential = await createUserWithEmailAndPassword(auth, email, password);
					const user = userCredential.user;
					const currentUser = getAuth().currentUser;
					await updateProfile(user, {
						displayName: name
					});
					if (currentUser) {
						await sendEmailVerification(currentUser).then(() => {
							console.log('Sent verification mail.');
						});
					}

					showToast({ msg: `Sent an email verification to <b>${email}</b>` });
					goto(redirect || '/', { replaceState: true });
				} catch (error: any) {
					console.error(error);
					let msg = getAuthErrorMessage(error.code || '');
					showToast({ msg: msg });
				}
			}

			isSubmited = false;
		}
	}

	function init() {
		redirect = new URLSearchParams(window.location.search).get('redirect') || '';
	}

	$effect(() => {
		init();
	});
</script>

<svelte:head />

<div class="sm:mx-auto sm:w-full sm:max-w-md">
	<img class="mx-auto h-10 w-auto" src="/icons/web/icon-192.png" alt="App Logo" />
	<h2 class="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-base-900">
		{title}
	</h2>
</div>
<div class="my-10 mx-auto w-full max-w-[480px]">
	<div class="bg-white p-4 py-10 md:p-10 shadow rounded-lg">
		<form class="" onsubmit={handleSubmit}>
			<div>
				<div class="py-3">
					<TextField
						name="name"
						bind:value={name as string}
						label="Your name"
						required={true}
						autofocus={true}
						floatingLabel={false}
					/>
				</div>

				<div class="py-3">
					<EmailField
						name="email"
						bind:value={email as string}
						label="Email"
						required={true}
						floatingLabel={false}
					/>
				</div>
				<div class="py-3">
					<PhoneField
						name="phone"
						bind:value={phone as string}
						label="Phone number"
						dialCode="+91"
						floatingLabel={false}
					/>
				</div>
				<div class="py-3">
					<PasswordField
						name="password"
						bind:value={password as string}
						label="Password"
						required={true}
						floatingLabel={false}
					/>
				</div>
				<div class="py-3">
					<PasswordField
						name="confirmPassword"
						bind:value={confirmPassword as string}
						label="Confirm Password"
						required={true}
						floatingLabel={false}
					/>
				</div>
			</div>
			<div>
				<SigninPrivacyTermConsent></SigninPrivacyTermConsent>
			</div>
			<div>
				<div class="text-center">
					<div class="py-8">
						<Button
							id="btn-signup"
							type="submit"
							disabled={isSubmited}
							label={'Signup'}
							appearance="primary"
							className="w-full"
						></Button>
					</div>
				</div>
			</div>
		</form>
	</div>
</div>
<div>
	<AuthGotoLogin></AuthGotoLogin>
</div>
