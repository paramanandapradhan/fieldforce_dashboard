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
	import type { VisitDataModel } from '$lib/visit/visite-type';
	import { getVisit } from '$lib/visit/visit-service';
	import { openVisitEditDialog } from '$lib/visit/visite-ui-service';
	import VisitDetails from '$lib/visit/components/visit-details.svelte';

	let drawerRef: Drawer;

	let visitId: string = $derived(page.url.searchParams.get('visitId') || '');
	let visit: VisitDataModel | null = $state(null);

	function handleMore() {
		drawerRef && drawerRef.openDrawer();
	}

	async function loadVisit() {
		if (visitId) {
			visit = await getVisit(visitId);
		} else {
			visit = null;
		}
	}

	async function handleEdit(){
		if(visit){
			let res = await openVisitEditDialog(visit)
			if(res){
				loadVisit()
			}
		}
	}

	onMount(() => {
		loadVisit()
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
					<div><h1 class="text-xl font-black">Visit Details</h1></div>
					<div>
						<Button appearance="border-primary" onClick={handleEdit} label="Edit" />
					</div>
				</div>
				<div class="pb-32">
					{#if visit != null}
					<div class="bg-white p-4 shadow rounded-lg m-4">
						<VisitDetails {visitId}/>
					</div>
					{/if}
				</div>
			</main>
		</BackgroundGradient>
	</ContentArea>
</div>
