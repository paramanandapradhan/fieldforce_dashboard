<script lang="ts">
	import {
		ButtonListItem,
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
	import WindowInfiniteScroll from '$lib/core/components/window-infinite-scroll.svelte';

	type Props = {};
	let {}: Props = $props();

	let routes: RouteDataModel[] = $state([]);
	// let paginatedRoutes: RouteDataModel[] = $state([]);
	let pageIndex: number = $state(0);
	let pageSize: number = $state(10);
	let isLoading: boolean = $state(true);
	let searchText: string = $state('');

	let filteredRoutes = $derived(
		routes.filter((route) =>
			searchText ? route.name?.toLowerCase().includes(searchText.toLowerCase()) : true
		)
	);

	let paginatedRoutes = $derived(filteredRoutes.slice(0, (pageIndex + 1) * pageSize));

	export async function loadRoutes() {
		isLoading = true;
		let array = (await getAllRoutes()) || [];
		routes = sort({ array, field: 'name' });
		loadMore();
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

	// Infinite scrolling logic
	function loadMore() {
		pageIndex++;
	}

	onMount(() => {
		loadRoutes();
	});
</script>

<WindowInfiniteScroll {loadMore} triggerDistance={500} side="bottom" />
<div class="p-4">
	<SearchField bind:value={searchText} placeholder="Search Routes..." />
</div>
<div>
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
		{#each paginatedRoutes as route, index}
			<ButtonListItem onClick={() => handelViewRoute(route)}>
				<div>
					<IconCircle
						iconPath={mdiMapMarkerPath}
						iconClassName="!h-5 !w-5 text-primary"
						circleClassName="!h-10 !w-10"
					/>
				</div>
				<div class="flex-grow px-2">
					<div>
						{route.name || ''}
					</div>
					<div class="text-base-500 text-sm">
						{route.desc || ''}
					</div>
				</div>
				<div class="flex justify-end">
					<ButtonMenu
						menus={['View', 'Edit', 'Delete']}
						onMenu={(ev, menu) => handleMenu(ev, menu as string, route)}
						iconClassName="text-base-400 hover:text-base-800 {appState.theme == 'light'
							? ''
							: 'dark:hover:text-base-200'}"
					/>
				</div>
			</ButtonListItem>
		{/each}
	{/if}
</div>
