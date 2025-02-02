<script lang="ts">
	import { getAuthOrgId } from '$lib/auth/services/auth-service.svelte';
	import { formatFileSize } from '$lib/core/services/app-utils-service';
	import { getFile } from '../file-service';
	import type { FileDataModel } from '../file-type';

	type Props = {
		input?: string;
	};

	let { input }: Props = $props();

	let filePromise: FileDataModel | null = $derived.by(async () => {
		let oid = getAuthOrgId();
		if (input && oid) {
			return await getFile(input);
		}
		return null;
	});
</script>

{#await filePromise then file}
	{#if file}
		<span>{formatFileSize(file.size) || ''} </span>
	{/if}
{/await}
