<script lang="ts">
	import {
		Button,
		CheckboxField,
		ColorField,
		ContentArea,
		Drawer,
		isMobileScreen,
		Sidebar
	} from '@cloudparker/moldex.js';
	import AppNavbar from '$lib/core/components/app-navbar.svelte';
	import BackgroundGradient from '$lib/core/components/background-gradient.svelte';
	import RestrictedDrawer from '$lib/drawer/components/restricted-drawer.svelte';
	import { openRouteEditDialog } from '$lib/route/route-ui-service';
	import { mdiSync } from '$lib/core/services/app-icons-service';
	import { syncRoutes } from '$lib/route/route-service';

	let drawerRef: Drawer;

	function handleMore() {
		drawerRef && drawerRef.openDrawer();
	}

	async function handleAdd() {
		let res = await openRouteEditDialog();
		if (res) {
		}
	}

	async function handleSync() {
		await syncRoutes();
		// load list
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
						<Button appearance="base" onClick={handleSync} title="Sync" iconPath={mdiSync} />
					</div>
					<div>
						<Button appearance="border-primary" onClick={handleAdd} label="Add Route" />
					</div>
				</div>
			</main>
		</BackgroundGradient>
	</ContentArea>
</div>
