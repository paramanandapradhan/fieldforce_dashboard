<script lang="ts">
	import { Spinner } from '@cloudparker/moldex.js';
	import { getAgent } from '../services/agent-service';
	import type { AgentDataModel } from '../types/agent-types';
	import BaseDataModelDetails from '$lib/core/components/base-data-model-details.svelte';

	type Props = {
		agentId: string;
	};

	let { agentId }: Props = $props();

	let agentPromise: Promise<AgentDataModel | null> = $derived.by(async () => {
		return await getAgent(agentId);
	});
</script>

{#await agentPromise}
	<div><Spinner /></div>
{:then agent}
	<div class="flex flex-col h-full">
		<div class="px-6">
			<table class=" ">
				<tbody>
					<tr>
						<td>Agent Name</td>
						<td class="font-bold">{agent?.name || '-'}</td>
					</tr>
					<tr>
						<td>Description</td>
						<td>{agent?.desc || '-'}</td>
					</tr>
					<tr>
						<td>Language</td>
						<td>{agent?.lang}</td>
					</tr>

					<tr>
						<td>Gender</td>
						<td>{agent?.gender}</td>
					</tr>
				</tbody>
			</table>
		</div>
		<div class="mt-6 p-6 border-t bg-base-100 flex-grow">
			<BaseDataModelDetails data={agent!} />
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
