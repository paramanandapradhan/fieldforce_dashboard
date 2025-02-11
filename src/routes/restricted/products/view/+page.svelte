<script lang="ts">
	import {
		Button,
		CheckboxField,
		ColorField,
		ContentArea,
		Drawer,
		goBack,
		isMobileScreen,
		Sidebar
	} from '@cloudparker/moldex.js';
	import AppNavbar from '$lib/core/components/app-navbar.svelte';
	import BackgroundGradient from '$lib/core/components/background-gradient.svelte';
	import RestrictedDrawer from '$lib/drawer/components/restricted-drawer.svelte';
	import { page } from '$app/state';
	import type { ProductDataModel } from '$lib/product/product-type';
	import { getProduct } from '$lib/product/product-service';
	import { onMount } from 'svelte';
	import { openProductEditDialog } from '$lib/product/product-ui-service';
	import ProductDetails from '$lib/product/components/product-details.svelte';

	let drawerRef: Drawer;

	let productId: string = $derived(page.url.searchParams.get('productId') || '');
	let product: ProductDataModel | null = $state(null);

	function handleMore() {
		drawerRef && drawerRef.openDrawer();
	}

	async function loadProducts() {
		if (productId) {
			product = await getProduct(productId);
		} else {
			product = null;
		}
	}

	async function handleEdit(){
		if(product){
			let res = await openProductEditDialog(product)
			if(res){
				loadProducts()
			}
		}
	}

	onMount(() => {
		loadProducts()
	})
</script>

<div class="min-h-full">
	<AppNavbar title="VIEW PRODUCT" hasLogo hasTitle hasBack={isMobileScreen()} onBack={goBack} />
	<Drawer bind:this={drawerRef} className="border-r"><RestrictedDrawer /></Drawer>
	<Sidebar className="border-r "><RestrictedDrawer /></Sidebar>
	<ContentArea className="md:pl-72">
		<BackgroundGradient>
			<main>
				<div class="p-4 flex items-center justify-between">
					<div><h1 class="text-xl font-black">Products Details</h1></div>
					<div>
						<Button appearance="border-primary" onClick={handleEdit} label="Edit" />
					</div>
				</div>
				<div class="pb-32">
					{#if product != null}
					<div class="bg-white p-4 shadow rounded-lg m-4">
						<ProductDetails {productId}/>
					</div>
					{/if}
				</div>
			</main>
		</BackgroundGradient>
	</ContentArea>
</div>
