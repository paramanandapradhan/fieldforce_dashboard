<script lang="ts">
	import { initFirebaseAuth } from '$lib/auth/services/auth-service.svelte';
	import { initLocalDatabase } from '$lib/database/local-database-service';
	import { initFirebaseApp } from '$lib/firebase/firebase-service';
	import { onMount } from 'svelte';
	import { IS_DEV_ENV } from '../services/app-environment-service';

	type Props = {
		onReady?: () => void;
	};

	let { onReady }: Props = $props();

	async function init() {
		if (IS_DEV_ENV) {
			console.log('__init__');
		}
		await initLocalDatabase();
		await initFirebaseApp();
		await initFirebaseAuth();

		onReady && onReady();
	}

	onMount(() => {
		init();
	});
</script>
