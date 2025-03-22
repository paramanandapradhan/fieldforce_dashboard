<script lang="ts">
	import {
		ButtonListItem,
		ButtonMenu,
		IconCircle,
		Loading,
		mdiDotsHorizontal,
		mdiMagnify,
		navigate,
		NoData,
		Pagination,
		SearchField,
		sort
	} from '@cloudparker/moldex.js';
	
	import { onMount } from 'svelte';
	import WindowInfiniteScroll from '$lib/core/components/window-infinite-scroll.svelte';
	import {
	mdiBusMarker,
	mdiMapMarkerDistance,
		mdiNotebookOutline,
		mdiPackageVariantClosed
	} from '$lib/core/services/app-icons-service';
	import { appState } from '$lib/core/services/app-state.svelte';
	import type { VisitDataModel } from '../visite-type';
	import { getAllVisits } from '../visit-service';
	import { openVisitDeleteDialog, openVisitEditDialog } from '../visite-ui-service';

	let visits: VisitDataModel[] = $state([]);
	let pageIndex: number = $state(0);
	let pageSize: number = $state(10);
	let isLoading: boolean = $state(true);
	let searchText: string = $state('');

	let filteredVisits = $derived(
		visits.filter((item) => {
			const matchSearch = searchText
				? item.name?.toLowerCase().includes(searchText.toLowerCase())
				: true;
			return matchSearch;
		})
	);

	let paginatedVisits = $derived(
		filteredVisits.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)
	);

	$effect(() => {
		searchText ;
		pageIndex = 0;
	});

	export async function loadVisits() {
		isLoading = true;
		let array = await getAllVisits();
		visits = sort({ array, field: 'name' });
		isLoading = false;
	}

	async function handleMenu(ev: MouseEvent, menu: string, visit: VisitDataModel) {
		switch (menu) {
			case 'Edit':
				await openVisitEditDialog(visit);
				await loadVisits();
				break;
			case 'Delete':
				await openVisitDeleteDialog(visit);
				await loadVisits();
				break;
			case 'View':
				handleViewVisit(visit);
				break;
		}
	}

	function handleViewVisit(visit: VisitDataModel) {
		navigate(`/restricted/visits/view?visitId=${visit._id}`);
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

	// Infinite scrolling logic
	// function loadMore() {
	// 	pageIndex++;
	// }

	onMount(() => {
		loadVisits();
	});
</script>

<!-- <WindowInfiniteScroll {loadMore} triggerDistance={500} side="bottom" /> -->
<div class="p-4">
	<SearchField bind:value={searchText} placeholder="Search Visits..." />
</div>
<div>
	{#if isLoading}
		<Loading />
	{:else if searchText && filteredVisits.length <= 0}
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
	{:else if filteredVisits.length <= 0}
		<NoData>
			<IconCircle
				iconPath={mdiNotebookOutline}
				circleClassName="!bg-base-100 !w-12 !h-12"
				iconClassName="!w-6 !h-6 text-base-400"
			/>
			<div class="text-center text-base-400 text-sm mt-4">
				No Visits ! <br />Please add Visits!
			</div>
		</NoData>
	{:else}
		{#each paginatedVisits as visit, index}
			<ButtonListItem onClick={() => handleViewVisit(visit)} className="pe-2">
				<div>
					<IconCircle
						iconPath={mdiBusMarker}
						iconClassName="!h-5 !w-5 text-primary"
						circleClassName="!h-10 !w-10"
					/>
				</div>
				<div class="flex-grow px-2">
					<div>
						{visit.name || '-'}
					</div>
					<div class="text-base-500 text-sm">
						{visit.desc || ''}
					</div>
				</div>
				<div class="flex justify-end">
					<ButtonMenu
					className="!px-2"
						menus={['View', 'Edit', 'Delete']}
						iconPath={mdiDotsHorizontal}
						onMenu={(ev, menu) => handleMenu(ev, menu as string, visit)}
						iconClassName="text-base-400 hover:text-base-800 {appState.theme == 'light'
							? ''
							: 'dark:hover:text-base-200'}"
					/>
				</div>
			</ButtonListItem>
		{/each}
		<div class="p-4">
			<Pagination
				length={filteredVisits?.length}
				{pageIndex}
				{pageSize}
				onPageSizeChange={handlePageSizeChange}
				onPageIndexChange={handlePageIndexChange}
			/>
		</div>
	{/if}
</div>
