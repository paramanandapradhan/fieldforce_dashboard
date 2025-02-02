<script lang="ts">
	import AuthPasswordReset from '$lib/auth/components/auth-password-reset.svelte';
	import CopyRight from '$lib/core/components/footer.svelte';
	import { APP_NAME } from '$lib/core/services/app-environment-service';
</script>

<svelte:head>
	<title>Forgot Password - Send Reset Password Link | {APP_NAME}</title>
</svelte:head>

<div class="min-h-full bg-base-50 flex flex-col">
	<div class="flex min-h-full flex-col justify-center py-12 px-6 grow">
		<AuthPasswordReset />
	</div>
	<div>
		<CopyRight />
	</div>
</div>
