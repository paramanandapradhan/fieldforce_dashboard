<script lang="ts">
	import {
		ButtonListItem,
		ButtonMenu,
		IconCircle,
		Loading,
		navigate,
		Pagination,
		sort
	} from '@cloudparker/moldex.js';
	import { getAllRoutes } from '../route-service';
	import type { RouteDataModel } from '../route-types';
	import TextUser from '$lib/user/components/text-user.svelte';
	import { onMount } from 'svelte';
	import { mdiMapMarkerPath } from '$lib/core/services/app-icons-service';
	import { openRouteDeleteDialog, openRouteEditDialog } from '../route-ui-service';
	import { appState } from '$lib/core/services/app-state.svelte';
	import WindowInfiniteScroll from '$lib/core/components/window-infinite-scroll.svelte';

	type Props = {};
	let {}: Props = $props();

	let routes: RouteDataModel[] = $state([]);

	let paginatedRoutes: RouteDataModel[] = $state([]);
	let pageIndex: number = $state(0);
	let pageSize: number = $state(10);

	let isLoading: boolean = $state(false);

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

	function loadMore() {
		const start = pageIndex * pageSize;
		const end = start + pageSize;
		const newItems = routes.slice(start, end);
		if (newItems.length) {
			paginatedRoutes = [...paginatedRoutes, ...newItems];
			pageIndex++;
		}
	}

	onMount(() => {
		loadRoutes();
	});
</script>

<WindowInfiniteScroll {loadMore} triggerDistance={500} side="bottom" />
<div>
	{#if isLoading}
		<Loading />
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
				<div>
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
