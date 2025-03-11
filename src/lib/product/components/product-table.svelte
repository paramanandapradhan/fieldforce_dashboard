<script lang="ts">
	import { onMount } from 'svelte';
	import { getAllProducts } from '../product-service';
	import type { ProductDataModel } from '../product-type';
	import { openProductDeleteDialog, openProductEditDialog } from '../product-ui-service';
	import {
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
		mdiMagnify,
		mdiNotebookOutline,
		mdiPackageVariantClosed
	} from '$lib/core/services/app-icons-service';
	import { appState } from '$lib/core/services/app-state.svelte';
	import { UserSubtypeEnum } from '$lib/user/user-service';
	import TextUserSubtype from '$lib/user/components/text-user-subtype.svelte';
	import TextUser from '$lib/user/components/text-user.svelte';
	import TextAttributeType from '$lib/attribute/components/text-attribute-type.svelte';
	import TextAttribute from '$lib/attribute/components/text-attribute.svelte';

	let products: ProductDataModel[] = $state([]);
	let pageIndex: number = $state(0);
	let pageSize: number = $state(10);
	let searchText: string = $state('');
	let isLoading: boolean = $state(true);

	let filteredProducts = $derived(
		products.filter((item) => {
			const matchSearch = searchText
				? item.name?.toLowerCase().includes(searchText.toLowerCase())
				: true;
			return matchSearch;
		})
	);

	let paginatedProducts = $derived(
		filteredProducts.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)
	);

	export async function loadProducts() {
		isLoading = true;
		let array = await getAllProducts();
		products = sort({ array, field: 'name' });
		isLoading = false;
	}

	async function handleMenu(ev: MouseEvent, menu: string, product: ProductDataModel) {
		switch (menu) {
			case 'Edit':
				await openProductEditDialog(product);
				await loadProducts();
				break;
			case 'Delete':
				await openProductDeleteDialog(product);
				await loadProducts();
				break;
			case 'View':
				handleViewProduct(product);
				break;
		}
	}
	function handleViewProduct(product: ProductDataModel) {
		navigate(`/restricted/products/view?productId=${product._id}`);
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
		loadProducts();
	});
</script>

<div>
	<div class="p-4 max-w-72">
		<SearchField bind:value={searchText} placeholder="Search Products..." />
	</div>

	{#if isLoading}
		<Loading />
	{:else if searchText && filteredProducts.length <= 0}
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
	{:else if filteredProducts.length <= 0}
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
		<table class="min-w-full divide-y divide-base-200 dark:divide-base-500 table-fixed">
			<thead>
				<tr>
					<th class="text-left w-14 dark:text-base-300"></th>
					<th class="text-left p-4 dark:text-base-300">Name</th>
					<th class="text-left p-4 dark:text-base-300">MRP</th>
					<th class="text-left p-4 dark:text-base-300">Sales Price</th>
					<th class="text-left p-4 dark:text-base-300">Brand</th>
					<th class="text-left p-4 dark:text-base-300">Seller</th>
					<th class="text-right p-4 dark:text-base-300"></th>
				</tr>
			</thead>
			<tbody class="divide-y divide-base-200 dark:divide-base-500">
				{#each paginatedProducts as product, index}
					<tr>
						<td class="text-left pl-4 py-1 w-14 dark:text-base-300">
							<IconCircle
								iconPath={mdiPackageVariantClosed}
								iconClassName="!h-5 !w-5 text-primary"
								circleClassName="!h-10 !w-10"
							/>
						</td>
						<td class="text-left px-4 dark:text-base-300">
							<div>
								<a
									href="/restricted/products/view?productId={product._id}"
									class="hover:text-primary"
								>
									{product.name || '-'}
								</a>
							</div>
							<div class="text-sm text-base-500 dark:text-base-400">{product.desc || '-'}</div>
						</td>
						<td class="text-left px-4 dark:text-base-300">{product.mrp || '-'}</td>
						<td class="text-left px-4 dark:text-base-300">{product.salesPrice || '-'}</td>
						<td class="text-left px-4 dark:text-base-300"><TextAttribute input={product?.brand! || '-'} /> </td>
						<td class="text-left px-4 dark:text-base-300"> <TextUser input={product.seller || '-'} hideIcon /> </td>
						<td class="text-left px-4 dark:text-base-300">
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
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
		<div class="p-4">
			<Pagination
				length={filteredProducts?.length}
				{pageIndex}
				{pageSize}
				onPageSizeChange={handlePageSizeChange}
				onPageIndexChange={handlePageIndexChange}
			/>
		</div>
	{/if}
</div>
