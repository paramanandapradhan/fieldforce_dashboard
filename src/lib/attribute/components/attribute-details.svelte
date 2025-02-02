<script lang="ts">
	import { Spinner } from '@cloudparker/moldex.js';
	import { getAttribute } from '../attribute-service';
	import type { AttributeDataModel } from '../attribute-types';
	import TextAttributeType from './text-attribute-type.svelte';
	import TextAttribute from './text-attribute.svelte';
	import BaseDataModelDetails from '$lib/core/components/base-data-model-details.svelte';

	type Props = {
		attributeId: string;
	};

	let { attributeId }: Props = $props();

	let attributePromise: Promise<AttributeDataModel | null> = $derived.by(async () => {
		return await getAttribute(attributeId);
	});
</script>

{#await attributePromise}
	<div><Spinner /></div>
{:then attribute}
	<div class="flex flex-col h-full">
		<div class="px-6">
			<table class=" ">
				<tbody>
					<tr>
						<td>Attribute Name</td>
						<td class="font-bold">{attribute?.name || '-'}</td>
					</tr>
					<tr>
						<td>Description</td>
						<td>{attribute?.desc || '-'}</td>
					</tr>
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
		<div class="mt-6 p-6 border-t bg-base-100 flex-grow">
			<BaseDataModelDetails data={attribute!} />
		</div>
	</div>
{/await}

<style>
	td:nth-child(1) {
		color: var(--color-base-400);
		width: 180px;
	}
	td:nth-child(2) {
		color: var(--color-base-500);
		width: 180px;
	}
</style>
