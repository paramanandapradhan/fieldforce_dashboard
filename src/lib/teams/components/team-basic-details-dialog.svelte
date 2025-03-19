<script lang="ts">
	import { Spinner, TextCurrency, TextDate } from '@cloudparker/moldex.js';
	import BaseDataModelDetails from '$lib/core/components/base-data-model-details.svelte';

	import TextUser from '$lib/user/components/text-user.svelte';
	import TextAttribute from '$lib/attribute/components/text-attribute.svelte';
	import type { TeamDataModel } from '../team-type';
	import { getTeam } from '../team-service';

	type Props = {
		teamId: string;
	};

	let { teamId }: Props = $props();

	let teamPromise: Promise<TeamDataModel | null> = $derived.by(async () => {
		return await getTeam(teamId);
	});
</script>

{#await teamPromise}
	<div><Spinner /></div>
{:then team}
	<div class="flex flex-col h-full">
		<div class="px-6">
			<table class=" ">
				<tbody>
					<tr>
						<td>Name</td>
						<td class="font-bold">{team?.name || '-'}</td>
					</tr>
					<tr>
						<td>Desc</td>
						<td class="font-thin">{team?.desc || '-'}</td>
					</tr>
					<tr>
						<td>Manager</td>
						<td><TextUser input={team?.manager || '-'} hideIcon /></td>
					</tr>
				</tbody>
			</table>
		</div>
		<div class="mt-6 p-6 bg-base-100 dark:bg-base-700 flex-grow">
			<BaseDataModelDetails data={team!} />
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
