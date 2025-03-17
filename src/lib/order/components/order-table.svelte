<script lang="ts">
	import { onMount } from 'svelte';
	import { getAllOrders } from '../order-service';
	import type { OrderDataModel } from '../order-type';
	import {
		Button,
		IconCircle,
		Loading,
		NoData,
		Pagination,
		SearchField,
		sort,
		TextCurrency,
		TextDate
	} from '@cloudparker/moldex.js';
	import {
		mdiInformationOutline,
		mdiMagnify,
		mdiNotebookOutline,
		mdiPackageVariantClosed,
		mdiTextBoxCheckOutline
	} from '$lib/core/services/app-icons-service';
	import TextUserType from '$lib/user/components/text-user-type.svelte';
	import TextUser from '$lib/user/components/text-user.svelte';
	import TextAttribute from '$lib/attribute/components/text-attribute.svelte';

	import { getProduct } from '$lib/product/product-service';
	import type { OrgDataModel } from '$lib/org/org-types';
	import { openOrderDetailsDialog } from '../order-ui-service';
	import { appState } from '$lib/core/services/app-state.svelte';

	let orders: OrderDataModel[] = $state([]);
	let pageIndex: number = $state(0);
	let pageSize: number = $state(10);
	let searchText: string = $state('');
	let isLoading: boolean = $state(true);

	let filteredOrders = $derived(
		orders.filter((item) => {
			const matchSearch = searchText
				? item.customer?.toLowerCase().includes(searchText.toLowerCase())
				: true;
			return matchSearch;
		})
	);

	let paginatedOrders = $derived(
		filteredOrders.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)
	);

	export async function loadOrders() {
		isLoading = true;
		let array = await getAllOrders();
		for (let order of array) {
			if (order.items && order.items.length > 0) {
				order.items = await Promise.all(
					order.items.map(async (item) => {
						const product = await getProduct(item.product!);
						return {
							...item,
							productDetails: product
						};
					})
				);
			}
		}

		orders = sort({ array, field: 'date', desc: true, isDate: true });
		isLoading = false;
	}

	// async function handleMenu(ev: MouseEvent, menu: string, product: ProductDataModel) {
	// 	switch (menu) {
	// 		case 'Edit':
	// 			await openProductEditDialog(product);
	// 			await loadProducts();
	// 			break;
	// 		case 'Delete':
	// 			await openProductDeleteDialog(product);
	// 			await loadProducts();
	// 			break;
	// 		case 'View':
	// 			handleViewProduct(product);
	// 			break;
	// 	}
	// }

	// function handleViewProduct(product: ProductDataModel) {
	// 	navigate(`/restricted/products/view?productId=${product._id}`);
	// }

	// Handle page index changes
	function handlePageIndexChange(newPageIndex: number) {
		pageIndex = newPageIndex;
	}

	// Handle page size changes
	function handlePageSizeChange(newPageSize: number) {
		pageSize = newPageSize;
		pageIndex = 0;
	}

	async function handleOpenOrderDetailsDialog(order: OrderDataModel) {
		if (order._id) {
			await openOrderDetailsDialog(order._id);
		}
	}

	onMount(() => {
		loadOrders();
	});
</script>

<div>
	<div class="p-4 max-w-72">
		<SearchField bind:value={searchText} placeholder="Search Products..." />
	</div>

	{#if isLoading}
		<Loading />
	{:else if searchText && filteredOrders.length <= 0}
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
	{:else if filteredOrders.length <= 0}
		<NoData>
			<IconCircle
				iconPath={mdiTextBoxCheckOutline}
				circleClassName="!bg-base-100 !w-12 !h-12"
				iconClassName="!w-6 !h-6 text-base-400"
			/>
			<div class="text-center text-base-400 text-sm mt-4">
				No Orders ! <br />Please add orders!
			</div>
		</NoData>
	{:else}
		<table class="min-w-full divide-y divide-base-200 dark:divide-base-600 table-fixed">
			<thead>
				<tr>
					<th class="text-left w-14 dark:text-base-300"></th>
					<!-- <th class="text-left p-4 dark:text-base-300">ID</th> -->
					<th class="text-left p-4 dark:text-base-300">Date</th>

					<th class="text-left p-4 dark:text-base-300">Customer</th>
					<th class="text-left p-4 dark:text-base-300">Seller</th>
					<th class="text-left p-4 dark:text-base-300">Items</th>
					<!-- <th class="text-left p-4 dark:text-base-300">Order Type</th>
					<th class="text-left p-4 dark:text-base-300">Paymentmode</th> -->
					<th class="text-right p-4 dark:text-base-300">Amount</th>
					<th class="text-right p-4 dark:text-base-300"></th>
				</tr>
			</thead>
			<tbody class="divide-y divide-base-200 dark:divide-base-600">
				{#each paginatedOrders as order, index}
					<tr>
						<td class="text-left pl-4 py-1 w-14 dark:text-base-300">
							<IconCircle
								iconPath={mdiTextBoxCheckOutline}
								iconClassName="!h-5 !w-5 text-primary"
								circleClassName="!h-10 !w-10"
							/>
						</td>

						<td class="text-left px-4 dark:text-base-300">
							<div title="Order ID">
								<button
									class="hover:text-primary"
									type="button"
									onclick={() => handleOpenOrderDetailsDialog(order)}
								>
									{order._id}
								</button>
							</div>
							<div class="text-sm font-light text-base dark:text-base-500">
								<TextDate input={order?.cat} />
							</div>
						</td>

						<td class="text-left px-4 dark:text-base-300">
							<TextUser input={order?.customer || '-'} hideIcon />
						</td>
						<td class="text-left px-4 dark:text-base-300">
							<TextUser input={order?.seller || '-'} hideIcon />
						</td>
						<!-- <td class="text-left px-4 dark:text-base-300"
							><TextAttribute input={order?.orderType || '-'} />
						</td>
						<td class="text-left px-4 dark:text-base-300">
							<TextAttribute input={order?.paymentMode || '-'} />
						</td> -->
						<td class="text-left px-4 dark:text-base-300">
							{order?.items?.length || 0}
						</td>
						<td class="  px-4 dark:text-base-300 text-right">
							<TextCurrency input={order?.amount || 0} hasSymbol symbol="₹" />
						</td>
						<td class="text-right px-4 dark:text-base-300">
							<div class="flex justify-end">
								<Button
									iconPath={mdiInformationOutline}
									size="xs"
									onClick={() => handleOpenOrderDetailsDialog(order)}
									iconClassName="text-base-400 hover:text-base-800 {appState.theme == 'light'
										? ''
										: 'dark:hover:text-base-200'}"
								/>
							</div>
						</td>
						<!-- <td class="text-left px-4 dark:text-base-300">
							<div class="flex justify-end">
								<ButtonMenu
									menus={['View', 'Edit', 'Delete']}
									iconPath={mdiDotsHorizontal}
									onMenu={(ev, menu) => handleMenu(ev, menu as string, product)}
									iconClassName="text-base-400 hover:text-base-800 {appState.theme == 'light'
										? ''
										: 'dark:hover:text-base-200'}"
								/>
							</div>
						</td> -->
					</tr>
				{/each}
			</tbody>
		</table>
		<div class="p-4">
			<Pagination
				length={filteredOrders?.length}
				{pageIndex}
				{pageSize}
				onPageSizeChange={handlePageSizeChange}
				onPageIndexChange={handlePageIndexChange}
			/>
		</div>
	{/if}
</div>
