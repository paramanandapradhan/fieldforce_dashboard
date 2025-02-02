<script lang="ts">
	import { getCacheFileDownloadUrl } from '$lib/file/file-service';
	import { BROWSER } from 'esm-env';

	type Props = {
		input?: string;
		imgClass?: string;
		alt?: string;
		fallbackUrl?: string;
	};

	let { input, imgClass = '', alt, fallbackUrl = '/imgs/avatar.svg' }: Props = $props();

	let downloadUrlPromise = $derived(getCacheFileDownloadUrl(input));
</script>

{#await downloadUrlPromise}
	<img src={fallbackUrl} {alt} class=" w-full {imgClass}" />
{:then downloadUrl}
	<img src={downloadUrl || fallbackUrl} {alt} class=" w-full {imgClass}" />
{/await}
