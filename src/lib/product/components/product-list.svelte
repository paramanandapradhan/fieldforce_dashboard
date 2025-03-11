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
		SearchField,
		sort
	} from '@cloudparker/moldex.js';
	import { getAllProducts } from '../product-service';
	import type { ProductDataModel } from '../product-type';
	import { openProductDeleteDialog, openProductEditDialog } from '../product-ui-service';
	import { onMount } from 'svelte';
	import WindowInfiniteScroll from '$lib/core/components/window-infinite-scroll.svelte';
	import {
		mdiNotebookOutline,
		mdiPackageVariantClosed
	} from '$lib/core/services/app-icons-service';
	import { appState } from '$lib/core/services/app-state.svelte';

	let products: ProductDataModel[] = $state([]);
	// let filteredProducts: ProductDataModel[] = $state([]);
	// let paginatedProducts: ProductDataModel[] = $state([]);
	let pageIndex: number = $state(0);
	let pageSize: number = $state(10);
	let isLoading: boolean = $state(true);
	let searchText: string = $state('');

	let filteredProducts = $derived(
		products.filter((product) =>
			searchText ? product.name?.toLowerCase().includes(searchText.toLowerCase()) : true
		)
	);
	let paginatedProducts = $derived(filteredProducts.slice(0, (pageIndex + 1) * pageSize));

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

	// Infinite scrolling logic
	function loadMore() {
		pageIndex++;
	}

	onMount(() => {
		loadProducts();
	});
</script>

<WindowInfiniteScroll {loadMore} triggerDistance={500} side="bottom" />
<div class="p-4">
	<SearchField bind:value={searchText} placeholder="Search Products..." />
</div>
<div>
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
		{#each paginatedProducts as product, index}
			<ButtonListItem className="dark:hover:bg-base-600" onClick={() => handleViewProduct(product)}>
				<div>
					<IconCircle
						iconPath={mdiPackageVariantClosed}
						iconClassName="!h-5 !w-5 text-primary"
						circleClassName="!h-10 !w-10"
					/>
				</div>
				<div class="flex-grow px-2">
					<div>
						{product.name || '-'}
					</div>
					<div class="text-base-500 dark:text-base-400 text-sm">
						{product.desc || ''}
					</div>
				</div>
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
			</ButtonListItem>
		{/each}
	{/if}
</div>
