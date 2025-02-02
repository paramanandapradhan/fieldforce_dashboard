<script lang="ts">
	import { goto } from '$app/navigation';
	import type { FirebaseAuthClaimsType } from '$lib/auth/auth-types';
	import AuthUserReady from '$lib/auth/components/auth-user-ready.svelte';
	import { APP_LANDING_PAGE_PATH } from '$lib/core/services/app-environment-service';

	let imgClassName: string = $state('opacity-0');

	$effect(() => {
		setTimeout(() => {
			imgClassName = 'opacity-100';
		}, 100);
	});

	function handleAuthReady(claim: FirebaseAuthClaimsType) {
		if (claim) {
			goto('/admin/home');
		}
	}
</script>

<AuthUserReady onReady={handleAuthReady} />
<div class="min-h-full flex items-center justify-center">
	<div>
		<img
			class="mx-auto h-12 w-auto transition-opacity duration-1000 {imgClassName}"
			src="/icons/web/icon-192.png"
			alt="App Logo"
		/>
	</div>
</div>
