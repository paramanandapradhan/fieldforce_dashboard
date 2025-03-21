<script lang="ts">
	import TextUser from '$lib/user/components/text-user.svelte';
	import { Button, ButtonListItem, IconCircle, screenSize } from '@cloudparker/moldex.js';
	import type { RouteDataModel } from '../route-types';
	import { mdiInformationOutline, mdiMapMarkerPath } from '$lib/core/services/app-icons-service';
	import { appState } from '$lib/core/services/app-state.svelte';
	import { openRouteBasicDetailsDialog } from '../route-ui-service';

	type Props = {
		route?: RouteDataModel;
	};

	let { route }: Props = $props();

	async function handleOpenRouteBasicInfoDialog(route: RouteDataModel) {
		if (route?._id) {
			await openRouteBasicDetailsDialog(route._id);
		}
	}
</script>

<div>
	<div class="flex items-center gap-4">
		<div>
			<IconCircle
				iconPath={mdiMapMarkerPath}
				iconClassName="  text-primary"
				circleClassName=" "
			/>
		</div>
		<div class="flex-grow">
			<h4 class="text-xl font-bold dark:text-base-200">Route Details</h4>
		</div>
		<div class="flex justify-end">
			<Button
				iconPath={mdiInformationOutline}
				className="!px-2"
				onClick={() => handleOpenRouteBasicInfoDialog(route!)}
				iconClassName="text-base-400 hover:text-base-800 {appState.theme == 'light'
					? ''
					: 'dark:hover:text-base-200'}"
			/>
		</div>
	</div>
	<div class="mt-6">
		<table>
			<tbody>
				<tr class="lg:text-lg lg:font-bold font-semibold"
					><td>Route Name</td><td>{route?.name || '-'}</td></tr
				>
				<tr><td>Description</td><td class="text-base-500 text-sm">{route?.desc || '-'}</td></tr>
				<tr><td>Manager</td><td> <TextUser input={route?.manager || '-'} hideIcon /></td></tr>
				<tr>
					<td>Visit Plan</td>
					<td>{route?.plans ? Object.keys(route.plans).length : 0}</td>
				</tr>
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
		width: 180px;
	}
</style>
