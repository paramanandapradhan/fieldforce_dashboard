<script lang="ts">
	import AppNavbar from '$lib/core/components/app-navbar.svelte';
	import BackgroundGradient from '$lib/core/components/background-gradient.svelte';
	import RestrictedDrawer from '$lib/drawer/components/restricted-drawer.svelte';
	import CustomerTable from '$lib/user/components/customer-table.svelte';
	import { openCustomerEditDialog } from '$lib/user/customer-ui-service';
	import { Button, ContentArea, Drawer, isMobileScreen, Sidebar } from '@cloudparker/moldex.js';

	let drawerRef: Drawer;

	function handleMore() {
		drawerRef && drawerRef.openDrawer();
	}

	async function handleAdd() {
		let res = await openCustomerEditDialog();
		if (res) {
		}
	}
</script>

<div class="min-h-full">
	<AppNavbar hasLogo hasTitle hasMore={isMobileScreen()} onMore={handleMore} />
	<Drawer bind:this={drawerRef} className="border-r"><RestrictedDrawer /></Drawer>
	<Sidebar className="border-r "><RestrictedDrawer /></Sidebar>
	<ContentArea className="md:pl-72">
		<BackgroundGradient>
			<main>
				<div class="p-4 flex items-center justify-between">
					<div><h1 class="text-xl font-black">Customers</h1></div>
					<div>
						<Button appearance="border-primary" onClick={handleAdd} label="Create Customers" />
					</div>
				</div>
				<div class="m-4 p-4 bg-white shadow rounded-lg">
					<CustomerTable />

				</div>
			</main>
		</BackgroundGradient>
	</ContentArea>
</div>
