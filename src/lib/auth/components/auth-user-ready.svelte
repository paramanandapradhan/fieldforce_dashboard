<script lang="ts">
	import { onMount } from 'svelte';
	import type { FirebaseAuthClaimsType } from '../auth-types';
	import { authState } from '../services/auth-state.svelte';

	type Props = {
		onReady: (claim: FirebaseAuthClaimsType) => void;
	};

	let { onReady }: Props = $props();

	$effect(() => {
		if (authState.firebaseAuthClaims) {
			onReady && onReady(authState.firebaseAuthClaims);
		}
	});
</script>
