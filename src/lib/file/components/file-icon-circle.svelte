<script lang="ts">
	import { mdiFile } from '$lib/core/services/app-icons-service';
	import { IconCircle } from '@cloudparker/moldex.js';
	import { getFile, getFileIcon } from '../file-service';

	type Props = {
		input?: string;
		iconPath?: string;
		iconClassName?: string;
		circleClassName?: string;
	};

	let { input, iconPath = mdiFile, iconClassName, circleClassName }: Props = $props();

	let filePromise = $derived.by(async () => {
		if (input) {
			return await getFile(input);
		}
	});
</script>

{#await filePromise then file}
	{#if file}
		<IconCircle iconPath={getFileIcon(file) || iconPath} {iconClassName} {circleClassName} />
	{/if}
{/await}
