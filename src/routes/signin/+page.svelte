<script lang="ts">
	import AuthLogin from '$lib/auth/components/auth-login.svelte';
	import CopyRight from '$lib/core/components/footer.svelte';
	import { APP_NAME } from '$lib/core/services/app-environment-service';
</script>

<svelte:head>
	<title>Signin | {APP_NAME}</title>
</svelte:head>

<div class="min-h-full bg-base-50 flex flex-col">
	<div class="flex min-h-full flex-col justify-center py-12 px-6 grow">
		<AuthLogin></AuthLogin>
	</div>
	<div>
		<CopyRight />
	</div>
</div>
