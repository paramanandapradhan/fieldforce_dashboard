<script lang="ts">
	import { Spinner, TextCurrency, TextDate } from '@cloudparker/moldex.js';
	import BaseDataModelDetails from '$lib/core/components/base-data-model-details.svelte';

	import TextUser from '$lib/user/components/text-user.svelte';
	import TextAttribute from '$lib/attribute/components/text-attribute.svelte';
	import type { VisitDataModel } from '../visite-type';
	import { getVisit } from '../visit-service';

	type Props = {
		visitsId: string;
	};

	let { visitsId }: Props = $props();

	let visitsPromise: Promise<VisitDataModel | null> = $derived.by(async () => {
		return await getVisit(visitsId);
	});
</script>

{#await visitsPromise}
	<div><Spinner /></div>
{:then visit}
	<div class="flex flex-col h-full">
		<div class="px-6">
			<table class=" ">
				<tbody>
					<tr>
						<td>Visit Purpose</td>
						<td class="font-bold">{visit?.name || '-'}</td>
					</tr>
					<tr>
						<td>Visit Details</td>
						<td class="font-thin">{visit?.desc || '-'}</td>
					</tr>
					<tr>
						<td>Vistor</td>
						<td><TextUser input={visit?.cby || '-'} hideIcon /></td>
					</tr>
					<tr>
						<td>Visit Type</td>
						<td><TextAttribute input={visit?.type || '-'} /></td>
					</tr>
					<tr>
						<td>Customer</td>
						<td><TextUser input={visit?.customer || '-'} hideIcon /></td>
					</tr>
					<tr>
						<td>Planned</td>
						<td
							>{#if visit?.isPlanned == true}
								Yes
							{:else}
								No
							{/if}</td
						>
					</tr>
				</tbody>
			</table>
		</div>
		<div class="mt-6 p-6 bg-base-100 dark:bg-base-700 flex-grow">
			<BaseDataModelDetails data={visit!} />
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
