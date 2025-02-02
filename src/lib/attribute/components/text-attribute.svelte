<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getAttribute } from '../attribute-service';
	import type { AttributeDataModel } from '../attribute-types';

	type Props = {
		input?: string | string[];
		emptyText?: string;
		view?: Snippet<[string[]]>;
	};

	let { view, input, emptyText = '-' }: Props = $props();

	let attributeNamesPromise: Promise<string[]> = $derived.by(async () => {
		let results: (AttributeDataModel | null)[] = [];
		if (Array.isArray(input)) {
			results = await Promise.all(input.map(async (o) => await getAttribute(o)));
		} else if (input) {
			console.log('input', input);
			let attr = await getAttribute(input);
			console.log('attr', attr);
			results = [attr];
		}
		let res = (results || []).filter((o) => o).map((o: AttributeDataModel | null) => o?.name || '');

		console.log('res', res);
		return res;
	});
</script>

{#snippet defaultView(attributeNames: string[])}
	{attributeNames.join(', ') || emptyText}
{/snippet}

<span>
	{#await attributeNamesPromise then attributeNames}
		{#if view}
			{@render view(attributeNames)}
		{:else}
			{@render defaultView(attributeNames)}
		{/if}
	{/await}
</span>
