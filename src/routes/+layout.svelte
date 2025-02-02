<script lang="ts">
	import AppInitializer from '$lib/core/components/app-initializer.svelte';
	import ThemeInitializer from '$lib/core/components/theme-initializer.svelte';
	import { IS_DEV_ENV } from '$lib/core/services/app-environment-service';
	import { ScreenDetector } from '@cloudparker/moldex.js';
	import '../tailwind.css';

	let { children } = $props();

	let isReady = $state(false);

	function handleReady() {
		isReady = true;
		if (IS_DEV_ENV) {
			console.log('Application is ready!');
		}
	}
</script>

<ThemeInitializer />
<ScreenDetector />
<AppInitializer onReady={handleReady} />

{#if isReady}
	{@render children()}
{/if}
