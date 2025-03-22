<script lang="ts">
	import {
		Button,
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

	import {
		mdiBriefcaseAccount,
		mdiBriefcaseAccountOutline,
		mdiInformationOutline,
		mdiMapMarkerPath,
		mdiNotebookOutline
	} from '$lib/core/services/app-icons-service';
	import { onMount } from 'svelte';
	import { getAllUsers, UserTypeEnum } from '../user-service';
	import type { CustomerDataModel } from '../user-types';
	import TextUserSubtype from './text-user-subtype.svelte';
	import TextAttribute from '$lib/attribute/components/text-attribute.svelte';
	import {
		openCustomerBasicDetailsDialog,
		openCustomerDeleteDialog,
		openCustomerEditDialog
	} from '../customer-ui-service';
	import { appState } from '$lib/core/services/app-state.svelte';
	import WindowInfiniteScroll from '$lib/core/components/window-infinite-scroll.svelte';

	type Props = {
		customers?: CustomerDataModel[];
	};
	let { customers }: Props = $props();

	let items: CustomerDataModel[] = $state([]);

	// let paginatedCustomers: CustomerDataModel[] = $state([]);
	let pageIndex: number = $state(0);
	let pageSize: number = $state(10);
	let searchText: string = $state('');
	let isLoading: boolean = $state(true);

	let filteredCustomers = $derived(
		items.filter((item) => {
			const matchSearch = searchText
				? item.name?.toLowerCase().includes(searchText.toLowerCase())
				: true;
			return matchSearch;
		})
	);

	let paginatedCustomers = $derived(
		filteredCustomers.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)
	);

	$effect(() => {
		searchText;
		pageIndex = 0;
	});

	export async function loadCustomers() {
		if (!customers) {
			isLoading = true;
			let array =
				((await getAllUsers({ type: UserTypeEnum.USER_TYPE_CUSTOMER })) as CustomerDataModel[]) ||
				[];
			items = sort({ array, field: 'name' });
			isLoading = false;
		}
	}

	export async function handleMenu(ev: Event, menu: string, item: CustomerDataModel) {
		switch (menu) {
			case 'Edit':
				await openCustomerEditDialog(item);
				await loadCustomers();
				break;
			case 'Delete':
				await openCustomerDeleteDialog(item);
				await loadCustomers();
				break;
			case 'View':
				handelViewCustomer(item);
				break;
		}
	}

	function handelViewCustomer(cuastomer: CustomerDataModel) {
		navigate(`/restricted/customers/view?customerId=${cuastomer._id}`);
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
		loadCustomers();
	});
</script>

<div class="p-4">
	<SearchField bind:value={searchText} placeholder="Search Customers..." />
</div>
<!-- <WindowInfiniteScroll {loadMore} triggerDistance={500} side="bottom" /> -->
<div>
	{#if isLoading}
		<Loading />
	{:else if searchText && filteredCustomers.length <= 0}
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
	{:else if filteredCustomers.length <= 0}
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
		{#each customers || paginatedCustomers as item, index}
			<ButtonListItem onClick={() => handelViewCustomer(item)} className="!pr-2">
				<div>
					<IconCircle
						iconPath={mdiBriefcaseAccountOutline}
						iconClassName="!h-5 !w-5 text-primary"
						circleClassName="!h-10 !w-10"
					/>
				</div>
				<div class="flex-grow px-2">
					<div>
						{item.name || ''}
					</div>
					<div class="text-base-500 text-sm">
						{item.desc || ''}
					</div>
				</div>

				<div>
					<ButtonMenu
						className="!px-2"
						menus={['View', 'Edit', 'Delete']}
						onMenu={(ev, menu) => handleMenu(ev, menu as string, item)}
						iconClassName="text-base-400 hover:text-base-800 {appState.theme == 'light'
							? ''
							: 'dark:hover:text-base-200'}"
					/>
				</div>
			</ButtonListItem>
		{/each}
		<div class="p-4">
			<Pagination
				length={filteredCustomers?.length}
				{pageIndex}
				{pageSize}
				onPageSizeChange={handlePageSizeChange}
				onPageIndexChange={handlePageIndexChange}
			/>
		</div>
	{/if}
</div>
