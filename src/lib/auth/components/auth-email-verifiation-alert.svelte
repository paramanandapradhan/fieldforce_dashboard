<script lang="ts">
	import { mdiAlertOctagon } from '$lib/core/services/app-icons-service';
	import { Button, Icon, openLoadingDialog, showToast } from '@cloudparker/moldex.js';
	import AuthUserReady from './auth-user-ready.svelte';
	import {
		checkEmailVerified,
		getFirebaseAuthUserEmail,
		resendEmailVerification
	} from '../services/auth-service.svelte';

	let email: string = $state('');

	async function handleResendVerificationEmail() {
		await resendEmailVerification();
	}

	async function handleVerfyNow() {
		let loader = await openLoadingDialog({
			msg: 'Check email verification status...'
		});

		let result = await checkEmailVerified();
		await loader.closeDialog();
		if (!result) {
			showToast({ msg: 'Email successfully verified.' });
		} else {
			showToast({ msg: 'Email not yet verified!' });
		}
	}

	function handleAuthReady() {
		email = getFirebaseAuthUserEmail() || '';
		console.log('handleAuthReady', email);
	}
</script>

<AuthUserReady onReady={handleAuthReady} />

<div class="bg-white shadow rounded p-4">
	<div class="flex flex-col md:flex-row gap-4">
		<div>
			<Icon path={mdiAlertOctagon} className="text-primary  !w-16 !h-16"></Icon>
		</div>
		<div class="ms-3">
			<h6 class="text-primary text-2xl font-bold">Email Verification</h6>
			<div class="my-4 text-base">
				Email verification is necessary to start using the application.
			</div>
			<div class=" ">
				{#if !email}
					<div class="animate-pulse">
						<div class="h-6 bg-base-100 rounded"></div>
					</div>
				{:else}
					<span class="font-bold break-all">{email}</span>
				{/if}
			</div>
			<div class="flex flex-col md:flex-row gap-4 flex-wrap mt-10">
				<Button type="button" onClick={handleResendVerificationEmail} appearance="border">
					Resend verification email
				</Button>
				<Button type="button" className=" " onClick={handleVerfyNow} appearance="primary"
					>Verify Now</Button
				>
			</div>
		</div>
	</div>
</div>
