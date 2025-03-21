<script lang="ts">
	import { onMount } from 'svelte';
	import { Button, IconCircle, TextCurrency } from '@cloudparker/moldex.js';
	import {
	mdiFormatListBulleted,
		mdiInformationOutline,
		mdiPackageVariantClosed
	} from '$lib/core/services/app-icons-service';
	import TextAttribute from '$lib/attribute/components/text-attribute.svelte';
	import TextUser from '$lib/user/components/text-user.svelte';
	import { getAttribute } from '../attribute-service';
	import type { AttributeDataModel } from '../attribute-types';
	import { openAttributeDetailsDialog } from '../attribute-ui-service';
	import { appState } from '$lib/core/services/app-state.svelte';
	import TextAttributeType from './text-attribute-type.svelte';

	type Props = {
		attributeId: any;
	};

	let { attributeId }: Props = $props();
	let attribute: AttributeDataModel | null = $state(null);

	async function loadAttribute() {
		if (attributeId) {
			attribute = await getAttribute(attributeId);
		} else {
			attribute = null;
		}
	}

	async function handleItemClick(attribute: AttributeDataModel) {
		if (attribute?._id) {
			await openAttributeDetailsDialog(attribute._id);
		}
	}

	onMount(() => {
		loadAttribute();
	});
</script>

<div>
	<div class="flex items-center gap-4">
		<div>
			<IconCircle
				iconPath={mdiFormatListBulleted}
				iconClassName="text-primary"
				circleClassName=" "
			/>
		</div>
		<div class="flex-grow">
			<h4 class="text-xl font-bold dark:text-base-200">Attribute Details</h4>
		</div>
		<div>
			<Button
				iconPath={mdiInformationOutline}
				className="!px-2"
				onClick={() => handleItemClick(attribute!)}
				iconClassName="text-base-400 hover:text-base-800 {appState.theme == 'light'
					? ''
					: 'dark:hover:text-base-200'}"
			/>
		</div>
	</div>

	<div class="mt-6">
		<table class="table-fixed w-full">
			<tbody>
				<tr class="lg:text-lg lg:font-bold font-semibold">
					<td>Name</td><td>{attribute?.name || '-'}</td>
				</tr>
				<tr><td>Description</td><td class="text-base-500 text-sm">{attribute?.desc || '-'}</td></tr>
				<tr>
					<td>Type</td>
					<td> <TextAttributeType input={attribute?.type!} /> </td>
				</tr>
				{#if attribute?.parent}
					<tr>
						<td>Parent</td>
						<td> <TextAttribute input={attribute.parent || ''} /> </td>
					</tr>
				{/if}
			</tbody>
		</table>
	</div>
</div>

<style>
	td:nth-child(1) {
		color: var(--color-base-400);
		width: 180px;
	}
	td:nth-child(2) {
		color: var(--color-base-500);
		height: 40px;
		width: auto;
		max-width: 500px;
		word-wrap: break-word;
		overflow-wrap: break-word;
	}

	/* Responsive adjustments for small screens */
	@media (max-width: 768px) {
		td:nth-child(1) {
			width: 100px; /* Further reduce width on small screens */
		}
		td:nth-child(2) {
			max-width: 100%; /* Allow full width on small screens */
			padding-left: 8px; /* Reduce left padding for tighter spacing */
		}
	}
</style>
