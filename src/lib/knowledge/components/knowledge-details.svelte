<script lang="ts">
	import { Spinner } from '@cloudparker/moldex.js';

	import BaseDataModelDetails from '$lib/core/components/base-data-model-details.svelte';
	import type { KnowledgeDataModel } from '../knowledge-types';
	import { getKnowledge } from '../knowledge-service';
	import TextAttribute from '$lib/attribute/components/text-attribute.svelte';

	type Props = {
		agentId: string;
		knowledge: KnowledgeDataModel;
	};

	let { agentId, knowledge }: Props = $props();
</script>

<div class="flex flex-col h-full">
	<div class="px-6">
		<table class=" ">
			<tbody>
				<tr>
					<td>Id</td>
					<td>{knowledge?._id}</td>
				</tr>
				<tr>
					<td>Topic</td>
					<td class="font-bold"><TextAttribute input={knowledge?.topic} /></td>
				</tr>
				<tr>
					<td>Description</td>
					<td>{knowledge?.text || '-'}</td>
				</tr>
			</tbody>
		</table>
	</div>
	<div class="mt-6 p-6 border-t bg-base-100 flex-grow">
		<BaseDataModelDetails data={knowledge!} />
	</div>
</div>

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
