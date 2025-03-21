<script lang="ts">
	import AppNavbar from '$lib/core/components/app-navbar.svelte';
	import BackgroundGradient from '$lib/core/components/background-gradient.svelte';
	import { mdiSync } from '$lib/core/services/app-icons-service';
	import RestrictedDrawer from '$lib/drawer/components/restricted-drawer.svelte';
	import CustomerList from '$lib/user/components/customer-list.svelte';
	import CustomerTable from '$lib/user/components/customer-table.svelte';
	import { openCustomerEditDialog } from '$lib/user/customer-ui-service';
	import { syncUsers } from '$lib/user/user-service';
	import {
		Button,
		ContentArea,
		Drawer,
		isMobileScreen,
		screenSize,
		Sidebar
	} from '@cloudparker/moldex.js';

	let drawerRef: Drawer;
	let customerTableRef: CustomerTable;
	let customerListRef: CustomerList;

	let isSyncInProgress = $state(false);

	function handleMore() {
		drawerRef && drawerRef.openDrawer();
	}

	async function handleAdd() {
		let res = await openCustomerEditDialog();
		if (res) {
			await loadCustomers();
		}
	}

	async function loadCustomers() {
		customerTableRef && customerTableRef.loadCustomers();
		customerListRef && customerListRef.loadCustomers();
	}

	async function handleSync() {
		isSyncInProgress = true;
		await syncUsers();
		await loadCustomers();
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
							<h1 class="text-xl font-black dark:text-base-200">Customers</h1>
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
								onClick={handleAdd}
								label="Create Customers"
								className="w-full sm:w-auto"
							/>
						</div>
					</div>
					{#if screenSize.isSm || screenSize.isMd || screenSize.isXs}
						<div class="m-4 pb-4 bg-white dark:bg-base-800 shadow rounded-lg">
							<CustomerList bind:this={customerListRef} />
						</div>
					{:else}
						<div class="m-4 p-4 bg-white dark:bg-base-800 shadow rounded-lg">
							<CustomerTable bind:this={customerTableRef} />
						</div>
					{/if}
				</div>
			</main>
		</BackgroundGradient>
	</ContentArea>
</div>
