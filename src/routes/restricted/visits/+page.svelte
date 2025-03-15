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
	
	import { syncProducts } from '$lib/product/product-service';
	import { mdiSync } from '$lib/core/services/app-icons-service';
	
	
	import { openVisitEditDialog } from '$lib/visit/visite-ui-service';
	import VisitList from '$lib/visit/components/visit-list.svelte';
	import VisitTable from '$lib/visit/components/visit-table.svelte';
	import { syncVisits } from '$lib/visit/visit-service';

	let drawerRef: Drawer;
	let visitListRef:VisitList;
	let visitTableRef:VisitTable
	

	let isSyncInProgress = $state(false);

	function handleMore() {
		drawerRef && drawerRef.openDrawer();
	}

	async function handleAddVistit() {
		let res = await openVisitEditDialog();
		if (res) {
			loadVisits();
		}
	}

	async function loadVisits() {
		visitTableRef && visitTableRef.loadVisits();
		visitListRef && visitListRef.loadVisits();

	}

	async function handleSync() {
		isSyncInProgress = true;
		await syncVisits();
		await loadVisits();
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
						<div class="flex-grow"><h1 class="text-xl font-black dark:text-base-200">Tour Visit</h1></div>
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
								onClick={handleAddVistit}
								label="Add Visit"
								className="w-full sm:w-auto"
							/>
						</div>
					</div>
					<div class="m-4 p-4 bg-white dark:bg-base-800 shadow rounded-lg">
						{#if screenSize.isSm || screenSize.isMd || screenSize.isXs}
							<VisitList  bind:this ={visitListRef}/>
						{:else}
							<VisitTable bind:this={visitTableRef} />
						{/if}
					</div>
				</div>
			</main>
		</BackgroundGradient>
	</ContentArea>
</div>
