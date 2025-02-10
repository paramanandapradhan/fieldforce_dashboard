<script lang="ts">
	import { ButtonMenu, IconCircle, navigate, Pagination, sort } from '@cloudparker/moldex.js';
	import { getAllRoutes } from '../route-service';
	import type { RouteDataModel } from '../route-types';
	import TextUser from '$lib/user/components/text-user.svelte';
	import { onMount } from 'svelte';
	import { mdiMapMarkerPath } from '$lib/core/services/app-icons-service';
	import { openRouteDeleteDialog, openRouteEditDialog } from '../route-ui-service';
	import { appState } from '$lib/core/services/app-state.svelte';

	type Props = {};
	let {}: Props = $props();

	let routes: RouteDataModel[] = $state([]);

	let paginatedRoutes: RouteDataModel[] = $state([]);
	let pageIndex: number = $state(0);
	let pageSize: number = $state(10);

	export async function loadRoutes() {
		let array = (await getAllRoutes()) || [];
		routes = sort({ array, field: 'name' });
	}

	export async function handleMenu(ev: Event, menu: string, item: RouteDataModel) {
		switch (menu) {
			case 'Edit':
				await openRouteEditDialog(item);
				await loadRoutes();
				break;
			case 'Delete':
				await openRouteDeleteDialog(item);
				await loadRoutes();
				break;
			case 'View':
				handelViewRoute(item);
				break;
		}
	}

	function handelViewRoute(route: RouteDataModel) {
		navigate(`/restricted/routes/view?routeId=${route._id}`);
	}

	$effect(() => {
		const start = pageIndex * pageSize;
		const end = start + pageSize;
		paginatedRoutes = routes.slice(start, end);
	});

	// Handle page index changes
	function handlePageIndexChange(newPageIndex: number) {
		pageIndex = newPageIndex;
	}

	// Handle page size changes
	function handlePageSizeChange(newPageSize: number) {
		pageSize = newPageSize;
		pageIndex = 0;
	}

	onMount(() => {
		loadRoutes();
	});
</script>

<div>
	<table class="min-w-full divide-y divide-base-200 table-fixed">
		<thead>
			<tr>
				<th class="text-left w-14"></th>
				<th class="text-left p-4">Name</th>
				<th class="text-left p-4">Manager</th>
				<th class="text-left p-4">Visit Plan</th>
				<th class="text-right p-4"></th>
			</tr>
		</thead>
		<tbody class="divide-y divide-base-200">
			{#each paginatedRoutes as route, index}
				<tr class="hover:bg-base-100">
					<td class="text-left pl-4 py-1 w-14">
						<IconCircle
							iconPath={mdiMapMarkerPath}
							iconClassName="!h-5 !w-5 text-primary"
							circleClassName="!h-10 !w-10"
						/>
					</td>
					<td class="text-left px-4">
						<div>
							<a href="/restricted/routes/view?routeId={route._id}" class="hover:text-primary">
								{route.name || ''}
							</a>
						</div>
						<div class="text-base-500 text-sm">
							{route.desc || ''}
						</div>
					</td>
					<td class="text-left px-4">
						<TextUser input={route.manager} hideIcon />
					</td>
					<td class="text-left px-4"></td>
					<td class="text-right px-4">
						<div class="flex justify-end">
							<ButtonMenu
								menus={['View', 'Edit', 'Delete']}
								onMenu={(ev, menu) => handleMenu(ev, menu as string, route)}
								iconClassName="text-base-400 hover:text-base-800 {appState.theme == 'light'
									? ''
									: 'dark:hover:text-base-200'}"
							/>
						</div>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
	<div class="p-4">
		<Pagination 
			length={routes?.length} 
			{pageIndex}
			{pageSize}
			onPageSizeChange={handlePageSizeChange}
			onPageIndexChange={handlePageIndexChange}

		/>
	</div>
</div>
