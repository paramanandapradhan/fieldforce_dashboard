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

	import {
		mdiBriefcaseAccount,
		mdiMapMarkerPath,
		mdiNotebookOutline
	} from '$lib/core/services/app-icons-service';
	import { onMount } from 'svelte';
	import { getAllUsers, UserTypeEnum } from '../user-service';
	import type { CustomerDataModel } from '../user-types';
	import TextUserSubtype from './text-user-subtype.svelte';
	import TextAttribute from '$lib/attribute/components/text-attribute.svelte';
	import { openCustomerDeleteDialog, openCustomerEditDialog } from '../customer-ui-service';
	import { appState } from '$lib/core/services/app-state.svelte';

	type Props = {
		customers?: CustomerDataModel[];
	};
	let { customers }: Props = $props();

	let items: CustomerDataModel[] = $state([]);

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

	onMount(() => {
		loadCustomers();
	});
</script>

<div>
	<div class="p-4 max-w-72">
		<SearchField bind:value={searchText} placeholder="Search Customers..." />
	</div>
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
		<table class="min-w-full divide-y divide-base-200 table-fixed">
			<thead>
				<tr>
					<th class="text-left w-14"></th>
					<th class="text-left p-4">Name</th>
					<th class="text-left p-4">Type</th>
					<th class="text-left p-4">City</th>
					<th class="text-left p-4">Area</th>
					<th class="text-right p-4"></th>
				</tr>
			</thead>
			<tbody class="divide-y divide-base-200">
				{#each customers || paginatedCustomers as item, index}
					<tr class="hover:bg-base-100">
						<td class="text-left pl-4 py-1 w-14">
							<IconCircle
								iconPath={mdiBriefcaseAccount}
								iconClassName="!h-5 !w-5 text-primary"
								circleClassName="!h-10 !w-10"
							/>
						</td>
						<td class="text-left px-4">
							<div>
								<a
									href="/restricted/customers/view?customerId={item._id}"
									class="hover:text-primary"
								>
									{item.name || ''}
								</a>
							</div>
							<div class="text-base-500 text-sm">
								{item.desc || ''}
							</div>
						</td>
						<td class="text-left px-4">
							<TextUserSubtype input={item.subtype} />
						</td>
						<td class="text-left px-4">
							<TextAttribute input={item?.geo?.city} />
						</td>
						<td class="text-left px-4">
							<TextAttribute input={item?.geo?.area} />
						</td>
						<td class="text-right px-4">
							<div class="flex justify-end">
								<ButtonMenu
									menus={['View', 'Edit', 'Delete']}
									onMenu={(ev, menu) => handleMenu(ev, menu as string, item)}
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
				length={filteredCustomers?.length}
				{pageIndex}
				{pageSize}
				onPageSizeChange={handlePageSizeChange}
				onPageIndexChange={handlePageIndexChange}
			/>
		</div>
	{/if}
</div>
