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
	import { openRouteEditDialog } from '$lib/route/route-ui-service';
	import { mdiSync } from '$lib/core/services/app-icons-service';
	import { syncRoutes } from '$lib/route/route-service';
	import RouteTable from '$lib/route/components/route-table.svelte';
	import RouteList from '$lib/route/components/route-list.svelte';

	let drawerRef: Drawer;

	let routeTableRef: RouteTable;
	let routeListRef: RouteList;

	let isSyncInProgress = $state(false);

	function handleMore() {
		drawerRef && drawerRef.openDrawer();
	}

	async function handleAdd() {
		let res = await openRouteEditDialog();
		if (res) {
			await loadRoutes();
		}
	}

	async function loadRoutes() {
		routeListRef && (await routeListRef.loadRoutes());
		routeTableRef && (await routeTableRef.loadRoutes());
	}

	async function handleSync() {
		isSyncInProgress = true;
		await syncRoutes();
		await loadRoutes();
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
				<div class="p-4 flex items-center gap-4">
					<div class="flex-grow"><h1 class="text-xl font-black">Routes</h1></div>
					<div>
						<Button
							appearance="base"
							onClick={handleSync}
							title="Sync"
							iconPath={mdiSync}
							iconClassName={isSyncInProgress ? 'animate-spin' : ''}
						/>
					</div>
					<div>
						<Button appearance="border-primary" onClick={handleAdd} label="Add Route" />
					</div>
				</div>
				<div>
					<div class="bg-white rounded-lg shadow p-4 m-4">
						{#if screenSize.isSm || screenSize.isMd || screenSize.isXs}
							<RouteList bind:this={routeListRef} />
						{:else}
							<RouteTable bind:this={routeTableRef} />
						{/if}
					</div>
				</div>
			</main>
		</BackgroundGradient>
	</ContentArea>
</div>
