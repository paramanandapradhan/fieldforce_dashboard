<script lang="ts">
	import { getCacheFileDownloadUrl } from '$lib/core/services/app-cache-service';

	type Props = {
		input?: string;
		imgClassName?: string;
		alt?: string;
	};

	let { input, imgClassName, alt = 'File' }: Props = $props();

	let downloadUrlPromise = $derived.by(async () => {
		if (input) {
			return await getCacheFileDownloadUrl(input);
		}
	});
</script>

{#await downloadUrlPromise then downloadUrl}
	{#if downloadUrl}
		<img src={downloadUrl} {alt} class={imgClassName} />
	{/if}
{/await}
