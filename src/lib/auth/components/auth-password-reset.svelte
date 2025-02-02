<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { APP_LOGIN_PAGE_PATH } from '$lib/core/services/app-environment-service';
	import { Button, EmailField, showToast } from '@cloudparker/moldex.js';
	import { BROWSER } from 'esm-env';
	import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
	import { getAuthErrorMessage } from '../services/auth-errors-service';

	type PropsType = {
		title?: string;
		email?: string;
	};

	let { title = 'Forgot password', email = '' }: PropsType = $props();

	let redirect: string = $state('');
	let isSubmited = $state(false);

	async function handleSubmit(ev: SubmitEvent) {
		ev.preventDefault();
		if (!isSubmited) {
			isSubmited = true;
			if (email) {
				const auth = getAuth();
				await sendPasswordResetEmail(auth, email)
					.then((user) => {
						showToast({ msg: 'Password reset link sent to you!' });
						gotoLogin();
					})
					.catch((error) => {
						console.error(error);
						let msg = getAuthErrorMessage(error.code || '');
						showToast({ msg });
					});
			}
			isSubmited = false;
		}
	}

	function handleCancel() {
		gotoLogin();
	}

	function gotoLogin() {
		goto(`${APP_LOGIN_PAGE_PATH}?redirect=${redirect}`, { replaceState: true });
	}

	function init() {
		redirect = new URLSearchParams(window.location.search).get('redirect') || '';
		// console.log('redirect', redirect);
		if (BROWSER) {
			email = $page.url.searchParams.get('email') || '';
		}
	}

	$effect(() => {
		init();
	});
</script>

<div class="sm:mx-auto sm:w-full sm:max-w-md">
	<img class="mx-auto h-10 w-auto" src="/icons/web/icon-192.png" alt="App Logo" />
	<h2 class="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-base-900">
		{title}
	</h2>
</div>
<div class="my-10 mx-auto w-full max-w-[480px]">
	<div class="bg-white p-4 py-10 md:p-10 shadow rounded-lg">
		<form class="" onsubmit={handleSubmit}>
			<div class="mt-4">
				<div class="my-3">
					<EmailField
						name="email"
						bind:value={email as string}
						label="Email"
						required={true}
						autofocus={true}
						floatingLabel={false}
					/>
				</div>
				<div class="flex-end gap-2 py-4">
					<Button
						id="btn-password-reset-mail"
						type="submit"
						disabled={isSubmited}
						label="Send password reset link"
						appearance="primary"
						className="w-full"
					/>
				</div>
				<div class="mt-8 flex justify-center">
					<Button
						id="btn-cancel"
						type="button"
						onClick={handleCancel}
						label="Cancel"
						className="w-full"
						appearance="base"
					></Button>
				</div>
			</div>
		</form>
	</div>
</div>
<div>
	<p class="text-center text-base-500 text-sm">
		We will send you an email with a password reset link.
	</p>
</div>
