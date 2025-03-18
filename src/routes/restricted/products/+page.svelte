<script lang="ts">
	import {
		Button,
		CheckboxField,
		ColorField,
		ContentArea,
		Drawer,
		isMobileScreen,
		screenSize,
		Sidebar
	} from '@cloudparker/moldex.js';
	import AppNavbar from '$lib/core/components/app-navbar.svelte';
	import BackgroundGradient from '$lib/core/components/background-gradient.svelte';
	import RestrictedDrawer from '$lib/drawer/components/restricted-drawer.svelte';
	import { openProductEditDialog } from '$lib/product/product-ui-service';
	import ProductTable from '$lib/product/components/product-table.svelte';
	import { syncProducts } from '$lib/product/product-service';
	import { mdiSync } from '$lib/core/services/app-icons-service';
	import ProductList from '$lib/product/components/product-list.svelte';

	let drawerRef: Drawer;
	let productTableRef: ProductTable;
	let productListRef: ProductList;

	let isSyncInProgress = $state(false);

	function handleMore() {
		drawerRef && drawerRef.openDrawer();
	}

	async function handleAddProduct() {
		let res = await openProductEditDialog();
		if (res) {
			loadProducts();
		}
	}

	async function loadProducts() {
		productTableRef && productTableRef.loadProducts();
		productListRef && productListRef.loadProducts();
	}

	async function handleSync() {
		isSyncInProgress = true;
		await syncProducts();
		await loadProducts();
		isSyncInProgress = false;
	}
</script>

<div class="min-h-full">
	<AppNavbar hasLogo hasTitle hasMore={isMobileScreen()} onMore={handleMore} />
	<Drawer bind:this={drawerRef} className="border-r"><RestrictedDrawer /></Drawer>
	<Sidebar className="border-r "><RestrictedDrawer /></Sidebar>
	<ContentArea className="md:pl-72">
		<BackgroundGradient>
			<main>
				<div class="pb-32">
					<div class="p-4 flex flex-wrap items-center gap-4">
						<div class="flex-grow">
							<h1 class="text-xl font-black dark:text-base-200">Products</h1>
						</div>
						<div>
							<Button
								appearance="base"
								onClick={handleSync}
								title="Sync"
								iconPath={mdiSync}
								iconClassName={isSyncInProgress ? 'animate-spin' : ''}
							/>
						</div>
						<div class="w-full sm:w-auto">
							<Button
								appearance="border-primary"
								onClick={handleAddProduct}
								label="Add Product"
								className="w-full sm:w-auto"
							/>
						</div>
					</div>
					{#if screenSize.isSm || screenSize.isMd || screenSize.isXs}
						<div class="m-4 bg-white dark:bg-base-800 shadow rounded-lg">
							<ProductList bind:this={productListRef} />
						</div>
					{:else}
						<div class="m-4 p-4 bg-white dark:bg-base-800 shadow rounded-lg">
							<ProductTable bind:this={productTableRef} />
						</div>
					{/if}
				</div>
			</main>
		</BackgroundGradient>
	</ContentArea>
</div>
