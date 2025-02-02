<script lang="ts">
	import {
		Button,
		CheckboxField,
		ColorField,
		ContentArea,
		Drawer,
		Sidebar
	} from '@cloudparker/moldex.js';
	import AppNavbar from '$lib/core/components/app-navbar.svelte';
	import BackgroundGradient from '$lib/core/components/background-gradient.svelte';
	import RestrictedDrawer from '$lib/drawer/components/restricted-drawer.svelte';
	import { getAllSkus } from '$lib/sku/sku-service';
	import { openSkuEditDialog } from '$lib/sku/sku-ui-service';
	import SkuList from '$lib/sku/components/sku-list.svelte';
	import AdminDrawer from '$lib/drawer/components/admin-drawer.svelte';

	let drawerRef: Drawer;

	let skuListRef: SkuList;

	function handleMore() {
		drawerRef && drawerRef.openDrawer();
	}

	async function handleAdd() {
		let res = await openSkuEditDialog();
		if (res) {
			skuListRef && skuListRef.loadSkus();
		}
	}
</script>

<div class="min-h-full">
	<AppNavbar hasLogo hasTitle />
	<Drawer bind:this={drawerRef} className="border-r"><AdminDrawer /></Drawer>
	<Sidebar className="border-r "><AdminDrawer /></Sidebar>
	<ContentArea className="md:pl-72">
		<BackgroundGradient>
			<main>
				<div class="p-8 flex items-center justify-between">
					<div><h1 class="text-xl font-black text-base-800 dark:text-base-300">SKU</h1></div>
					<div>
						<Button appearance="border-primary" onClick={handleAdd} label="ADD" />
					</div>
				</div>
				<div class="m-8 pb-16">
					<SkuList bind:this={skuListRef} />
				</div>
			</main>
		</BackgroundGradient>
	</ContentArea>
</div>
