<script lang="ts">
	import { Button, openLoadingDialog, screenSize } from '@cloudparker/moldex.js';
	import type { RouteDataModel } from '../route-types';
	import { openUserPickerDialog } from '$lib/user/user-ui-service';
	import { UserTypeEnum } from '$lib/user/user-service';
	import { syncRoutes, updateRoute } from '../route-service';
	import RoutePlannerUserTable from './route-planner-user-table.svelte';
	import RoutPlannerUserList from './rout-planner-user-list.svelte';

	type Props = {
		route: RouteDataModel;
		title?: string;
		addButtonLabel?: string;
		onChange?: () => void;
	};

	let { route, title = 'Route Planning', addButtonLabel = 'Add User', onChange }: Props = $props();

	async function handleUserPicker() {
		if (route?._id) {
			let userId = await openUserPickerDialog({ userType: UserTypeEnum.USER_TYPE_USER });
			if (userId) {
				let loader = await openLoadingDialog();
				await updateRoute(route?._id, { [`plans.${userId}`]: [] });
				await syncRoutes();
				handleChange();
				loader.closeDialog();
			}
		}
	}

	function handleChange() {
		onChange && onChange();
	}

	$effect(() => {
		console.log('Route changed in planner ', route);
	});
</script>

<div>
	<div class="flex">
		<div class=" flex-grow">
			<h3 class="text-lg font-bold">{title}</h3>
		</div>
		<div>
			<Button appearance="base" onClick={handleUserPicker}>{addButtonLabel}</Button>
		</div>
	</div>
	<div class="my-4">
		{#if screenSize.isSm || screenSize.isMd || screenSize.isXs}
			<RoutPlannerUserList {route} onChange={handleChange} />
		{:else}
			<RoutePlannerUserTable {route} onChange={handleChange} />
		{/if}
	</div>
</div>
