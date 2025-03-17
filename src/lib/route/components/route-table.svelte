<script lang="ts">
	import {
		ButtonMenu,
		IconCircle,
		Loading,
		mdiMagnify,
		navigate,
		NoData,
		Pagination,
		SearchField,
		sort
	} from '@cloudparker/moldex.js';
	import { getAllRoutes } from '../route-service';
	import type { RouteDataModel } from '../route-types';
	import TextUser from '$lib/user/components/text-user.svelte';
	import { onMount } from 'svelte';
	import { mdiMapMarkerPath, mdiNotebookOutline } from '$lib/core/services/app-icons-service';
	import { openRouteDeleteDialog, openRouteEditDialog } from '../route-ui-service';
	import { appState } from '$lib/core/services/app-state.svelte';

	type Props = {};
	let {}: Props = $props();

	let routes: RouteDataModel[] = $state([]);
	// let paginatedRoutes: RouteDataModel[] = $state([]);
	// let filteredRoutes: RouteDataModel[] = $state([]);
	let pageIndex: number = $state(0);
	let pageSize: number = $state(10);
	let searchText: string = $state('');
	let isLoading: boolean = $state(true);

	let filteredRoutes = $derived(
		routes.filter((rout) => {
			const matchSearch = searchText
				? rout.name?.toLowerCase().includes(searchText.toLowerCase())
				: true;
			return matchSearch;
		})
	);

	let paginatedRoutes = $derived(
		filteredRoutes.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)
	);

	export async function loadRoutes() {
		isLoading = true;
		let array = (await getAllRoutes()) || [];
		routes = sort({ array, field: 'name' });
		isLoading = false;
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
	<div class="p-4 max-w-72">
		<SearchField bind:value={searchText} placeholder="Search Routes..." />
	</div>
	{#if isLoading}
		<Loading />
	{:else if searchText && filteredRoutes.length <= 0}
		<NoData>
			<IconCircle
				iconPath={mdiMagnify}
				circleClassName="!bg-base-100 !w-12 !h-12"
				iconClassName="!w-6 !h-6 text-base-400"
			/>
			<div class="text-center text-base-400 text-sm mt-4">
				No search results found for "{searchText}"!.
			</div>
		</NoData>
	{:else if filteredRoutes.length <= 0}
		<NoData>
			<IconCircle
				iconPath={mdiNotebookOutline}
				circleClassName="!bg-base-100 !w-12 !h-12"
				iconClassName="!w-6 !h-6 text-base-400"
			/>
			<div class="text-center text-base-400 text-sm mt-4">
				No Products ! <br />Please add Products!
			</div>
		</NoData>
	{:else}
		<table class="min-w-full divide-y divide-base-200 dark:divide-base-600 dark:text-base-200 table-fixed">
			<thead>
				<tr>
					<th class="text-left w-14"></th>
					<th class="text-left p-4">Name</th>
					<th class="text-left p-4">Manager</th>
					<th class="text-left p-4">Visit Plan</th>
					<th class="text-right p-4"></th>
				</tr>
			</thead>
			<tbody class="divide-y divide-base-200 dark:divide-base-600">
				{#each paginatedRoutes as route, index}
					<tr class="hover:bg-base-100 dark:hover:bg-base-700">
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
				length={filteredRoutes?.length}
				{pageIndex}
				{pageSize}
				onPageSizeChange={handlePageSizeChange}
				onPageIndexChange={handlePageIndexChange}
			/>
		</div>
	{/if}
</div>
