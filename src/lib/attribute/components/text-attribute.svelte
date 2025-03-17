<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { getAttribute, getAttributeTypeConfig } from '../attribute-service';
	import type { AttributeDataModel, AttributeTypeConfig } from '../attribute-types';
	import { Icon } from '@cloudparker/moldex.js';

	type Props = {
		input?: string | string[];
		emptyText?: string;
		snippet?: Snippet<[AttributeDataModel[], AttributeTypeConfig | undefined | null]>;
	};

	let { snippet, input, emptyText = '-' }: Props = $props();

	let attributes: AttributeDataModel[] = $state([]);
	let attribute: AttributeDataModel | null = $state(null);
	let attributeNames: string = $state('');
	let attributeTypeConfig: AttributeTypeConfig | null | undefined = $state(null);

	async function loadAttributes() {
		if (Array.isArray(input)) {
			attributes = (
				(await Promise.all(input.map(async (o) => await getAttribute(o)))) || []
			).filter(Boolean) as AttributeDataModel[];
		} else if (input) {
			let attr = (await getAttribute(input)) as AttributeDataModel;
			if (attr) {
				attributes = [attr];
			} else {
				attributes = [];
			}
		}

		attribute = attributes[0];

		if (attribute?.type) {
			attributeTypeConfig = getAttributeTypeConfig(attribute?.type);
		}

		attributeNames = (attributes || [])
			.map((o: AttributeDataModel | null) => o?.name || '')
			.join(', ');
	}

	onMount(() => {
		loadAttributes();
	});
</script>

{#snippet defaultView()}
	<span class="flex gap-2 items-center">
		{#if attributeTypeConfig?.hasIcon && attributeTypeConfig?.iconPath}
			<Icon
				className={attributeTypeConfig?.iconClassName}
				path={attributeTypeConfig?.iconPath}
				color={attributeTypeConfig?.hasColor ? attribute?.color : ''}
			/>
		{/if}
		<span style={attributeTypeConfig?.hasTextColor ? `color:${attribute?.color || ''}` : ''}>
			{attributeNames || emptyText}
		</span>
	</span>
{/snippet}

{#if snippet}
	{@render snippet(attributes, attributeTypeConfig)}
{:else}
	{@render defaultView()}
{/if}
