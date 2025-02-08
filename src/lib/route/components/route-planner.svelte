<script lang="ts">
	import { Button } from '@cloudparker/moldex.js';
	import type { RouteDataModel } from '../route-types';
	import { openUserPickerDialog } from '$lib/user/user-ui-service';
	import { UserTypeEnum } from '$lib/user/user-service';
	import { syncRoutes, updateRoute } from '../route-service';
	import RoutePlannerUserTable from './route-planner-user-table.svelte';

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
				await updateRoute(route?._id, { [`plans.${userId}`]: [] });
				await syncRoutes();
				handleChange();
			}
		}
	}

	function handleChange() {
		onChange && onChange();
	}
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
		<RoutePlannerUserTable {route} onChange={handleChange} />
	</div>
</div>
