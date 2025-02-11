<script lang="ts">
	import {
		ButtonListItem,
		ButtonMenu,
		IconCircle,
		Loading,
		mdiDotsHorizontal,
		navigate,
		sort
	} from '@cloudparker/moldex.js';
	import { getAllProducts } from '../product-service';
	import type { ProductDataModel } from '../product-type';
	import { openProductDeleteDialog, openProductEditDialog } from '../product-ui-service';
	import { onMount } from 'svelte';
	import WindowInfiniteScroll from '$lib/core/components/window-infinite-scroll.svelte';
	import { mdiPackageVariantClosed } from '$lib/core/services/app-icons-service';
	import { appState } from '$lib/core/services/app-state.svelte';

	let products: ProductDataModel[] = $state([]);
	let paginatedProducts: ProductDataModel[] = $state([]);
	let pageIndex: number = $state(0);
	let pageSize: number = $state(10);
	let isLoading: boolean = $state(false);

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
				handelViewProduct(product);
				break;
		}
	}

	function handelViewProduct(product: ProductDataModel) {
		navigate(`/restricted/products/view?productId=${product._id}`);
	}

	function loadMore() {
		const start = pageIndex * pageSize;
		const end = start + pageSize;
		const newItems = products.slice(start, end);
		if (newItems.length) {
			paginatedProducts = [...paginatedProducts, ...newItems];
			pageIndex++;
		}
	}

	onMount(() => {
		loadProducts();
	});
</script>

<WindowInfiniteScroll {loadMore} triggerDistance={500} side="bottom" />
<div>
	{#if isLoading}
		<Loading />
	{:else}
		{#each products as product, index}
			<ButtonListItem onClick={() => handelViewProduct(product)}>
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
					<div class="text-base-500 text-sm">
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
