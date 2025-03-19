<script lang="ts">
	import { Spinner, TextCurrency, TextDate } from '@cloudparker/moldex.js';
	import BaseDataModelDetails from '$lib/core/components/base-data-model-details.svelte';
	
	import TextUser from '$lib/user/components/text-user.svelte';
	import TextAttribute from '$lib/attribute/components/text-attribute.svelte';
	import type { RouteDataModel } from '../route-types';
	import { getRoute } from '../route-service';
	

	type Props = {
		routeId: string;
	};

	let { routeId }: Props = $props();

	let routePromise: Promise<RouteDataModel | null> = $derived.by(async () => {
		return await getRoute(routeId);
	});
</script>

{#await routePromise}
	<div><Spinner /></div>
{:then route}
	<div class="flex flex-col h-full">
		<div class="px-6">
			<table class=" ">
				<tbody>
					<tr>
						<td>Name</td>
						<td class="font-bold">{route?.name || '-'}</td>
					</tr>
					<tr>
						<td>Desc</td>
						<td class="font-thin">{route?.desc || '-'}</td>
					</tr>
					<tr>
						<td>Manager</td>
						<td><TextUser input={route?.manager || '-'} hideIcon /></td>
					</tr>
					<tr>
						<td>Visit Plan</td>
						<td>{route?.plans ? Object.keys(route.plans).length : 0}</td>
					</tr>
					
				</tbody>
			</table>
		</div>
		<div class="mt-6 p-6  bg-base-100 dark:bg-base-700 flex-grow">
			<BaseDataModelDetails data={route!} />
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
