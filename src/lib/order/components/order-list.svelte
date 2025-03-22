<script lang="ts">
	import {
		mdiInformationOutline,
		mdiMagnify,
		mdiTextBoxCheckOutline
	} from '$lib/core/services/app-icons-service';
	import TextUser from '$lib/user/components/text-user.svelte';
	import {
		Button,
		ButtonListItem,
		ButtonMenu,
		ButtonSearch,
		IconCircle,
		Loading,
		NoData,
		openLoadingDialog,
		Pagination,
		SearchField,
		sort,
		TextCurrency,
		TextDate
	} from '@cloudparker/moldex.js';
	import { onMount } from 'svelte';
	import { getAllOrders } from '../order-service';
	import type { OrderDataModel } from '../order-type';

	import { appState } from '$lib/core/services/app-state.svelte';
	import {
		downloadOrderSheet,
		openOrderBasicDetailsDialog,
		openOrderDetailsDialog
	} from '../order-ui-service';
	import TextAttribute from '$lib/attribute/components/text-attribute.svelte';

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

	$effect(() => {
		searchText;
		pageIndex = 0;

	})

	export async function loadOrders() {
		isLoading = true;
		let array = await getAllOrders();
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

	

	async function handleMenu(ev: Event, menu: string) {
		switch (menu) {
			case 'Order Sheet':
				let loader = await openLoadingDialog();
				await downloadOrderSheet();
				loader.closeDialog();
				break;

			default:
				break;
		}
	}

	onMount(() => {
		loadOrders();
	});
</script>

<div>
	<div class="p-4 flex items-center gap-4">
		<div></div>
		<div class="flex-grow"></div>
		<div>
			<ButtonSearch onSearch={(text: string) => (searchText = text)} />
		</div>
		<div>
			<ButtonMenu menus={['Order Sheet']} onMenu={(ev, menu) => handleMenu(ev, menu as string)} />
		</div>
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
		{#each paginatedOrders as order, index}
			<ButtonListItem
				className="dark:hover:bg-base-600"
				onClick={() => handleOpenOrderDetailsDialog(order)}
			>
				<div>
					<IconCircle
						iconPath={mdiTextBoxCheckOutline}
						iconClassName="!h-5 !w-5 text-primary  "
						circleClassName="!h-10 !w-10  "
					/>
				</div>
				<div class="flex-grow px-2">
					<div class="flex gap-4">
						<div title="Order ID" class="flex-grow text-sm">
							{order._id}
						</div>
						<div class="text-sm" title="Items Count">{order?.items?.length || 0}</div>
						<div class="font-bold w-24 text-right text-sm" title="Amount">
							<TextCurrency input={order?.amount || 0} hasSymbol symbol="₹" />
						</div>
					</div>
					<div class="flex justify-between gap-4 text-xs font-light text-base dark:text-base-500">
						<div>
							<TextAttribute input={order.status} />
						</div>
						<div class="">
							<TextDate input={order?.cat} />
						</div>
					</div>

					<div class="text-xs font-light text-base dark:text-base-400">
						<span title="Customer"><TextUser input={order?.customer || '-'} hideIcon /></span>
					</div>

					<!-- <div class="mt-2 space-y-1">
						<p class="text-xs text-base-500">
							Customer: <TextUser input={order?.customer || '-'} hideIcon />
						</p>
						<p class="text-xs text-base-500">
							Items: {order?.items?.length || 0}
						</p>
					</div> -->
				</div>

				<!-- <div class="flex justify-end">
					<Button
						iconPath={mdiInformationOutline}
						size="xs"
						onClick={(ev) => handleOpenBasicInfo(ev, order)}
						iconClassName="text-base-400 hover:text-base-800 {appState.theme == 'light'
							? ''
							: 'dark:hover:text-base-200'}"
					/>
				</div> -->
			</ButtonListItem>
		{/each}
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
