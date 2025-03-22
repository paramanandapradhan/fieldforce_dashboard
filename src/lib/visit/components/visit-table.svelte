<script lang="ts">
	import { onMount } from 'svelte';

	import {
		Button,
		ButtonMenu,
		IconCircle,
		Loading,
		mdiDotsHorizontal,
		navigate,
		NoData,
		Pagination,
		SearchField,
		sort
	} from '@cloudparker/moldex.js';
	import {
		mdiAccount,
		mdiBusMarker,
		mdiInformationOutline,
		mdiMagnify,
		mdiMapMarkerDistance,
		mdiNotebookOutline,
		mdiPackageVariantClosed
	} from '$lib/core/services/app-icons-service';
	import { appState } from '$lib/core/services/app-state.svelte';
	import type { VisitDataModel } from '../visite-type';
	import { getAllVisits } from '../visit-service';
	import {
		openVisitDeleteDialog,
		openVisitEditDialog,
		openVisitsBasicDetailsDialog
	} from '../visite-ui-service';
	import TextUserSubtype from '$lib/user/components/text-user-subtype.svelte';
	import TextUser from '$lib/user/components/text-user.svelte';
	import TextAttributeType from '$lib/attribute/components/text-attribute-type.svelte';
	import TextAttribute from '$lib/attribute/components/text-attribute.svelte';

	let visits: VisitDataModel[] = $state([]);
	let pageIndex: number = $state(0);
	let pageSize: number = $state(10);
	let searchText: string = $state('');
	let isLoading: boolean = $state(true);

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

	async function handleOpenVisitsBasicInfoDialog(visit: VisitDataModel) {
		if (visit?._id) {
			await openVisitsBasicDetailsDialog(visit._id);
		}
	}

	onMount(() => {
		loadVisits();
	});
</script>

<div>
	<div class="p-4 max-w-72">
		<SearchField bind:value={searchText} placeholder="Search Visits..." />
	</div>

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
		<table
			class="min-w-full divide-y divide-base-200 dark:divide-base-600 dark:text-base-200 table-fixed"
		>
			<thead>
				<tr>
					<th class="text-left w-14"></th>
					<th class="text-left p-4">Visit Purpose</th>
					<th class="text-left p-4">Visit Details</th>
					<th class="text-left p-4">Vistor</th>
					<th class="text-left p-4">Visit Type</th>
					<th class="text-left p-4">Customer</th>
					<th class="text-left p-4">Planned</th>
					<th class="text-right"></th>
				</tr>
			</thead>
			<tbody class="divide-y divide-base-200 dark:divide-base-600">
				{#each paginatedVisits as visit, index}
					<tr>
						<td class="text-left pl-4 py-1 w-14">
							<IconCircle
								iconPath={mdiBusMarker}
								iconClassName="!h-5 !w-5 text-primary"
								circleClassName="!h-10 !w-10"
							/>
						</td>
						<td class="text-left px-4">
							<div>
								<a href="/restricted/visits/view?visitId={visit._id}" class="hover:text-primary">
									{visit.name || '-'}
								</a>
							</div>
						</td>
						<td class="text-left px-4"
							><div class="text-sm text-base-500">{visit.desc || '-'}</div></td
						>
						<td class="text-left px-4"><TextUser input={visit.cby || '-'} hideIcon /></td>
						<td class="text-left px-4"> <TextAttribute input={visit?.type || '-'} /> </td>
						<td class="text-left px-4"><TextUser input={visit?.customer || '-'} hideIcon /> </td>
						<td class="text-left px-4">
							{#if visit.isPlanned == true}
								Yes
							{:else}
								No
							{/if}
						</td>
						<td class="text-left">
							<div class="flex justify-end">
								<Button
									className="!px-2"
									iconPath={mdiInformationOutline}
									size="xs"
									onClick={() => handleOpenVisitsBasicInfoDialog(visit)}
									iconClassName="text-base-400 hover:text-base-800 {appState.theme == 'light'
										? ''
										: 'dark:hover:text-base-200'}"
								/>

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
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
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
