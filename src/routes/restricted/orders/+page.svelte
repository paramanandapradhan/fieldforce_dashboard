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
	import { getAllUsers, UserTypeEnum } from '$lib/user/user-service';
	import type { CustomerDataModel } from '$lib/user/user-types';
	import { openUserPickerDialog } from '$lib/user/user-ui-service';
	import { openAddToCartDialog } from '$lib/product/product-ui-service';
	import OrderTable from '$lib/order/components/order-table.svelte';
	import { syncOrders } from '$lib/order/order-service';
	import { mdiSync } from '$lib/core/services/app-icons-service';
	import OrderList from '$lib/order/components/order-list.svelte';

	let drawerRef: Drawer;
	let orderTableRef: OrderTable;
	let orderListRef: OrderList;

	let isSyncInProgress = $state(false);

	function handleMore() {
		drawerRef && drawerRef.openDrawer();
	}

	async function handleCreateOrder() {
		let customerId: string = (await openUserPickerDialog({
			userType: UserTypeEnum.USER_TYPE_CUSTOMER
		})) as string;
		if (customerId) {
			let res = await openAddToCartDialog(customerId);
			if (res) {
				loadOrders();
			}
		}
	}

	async function loadOrders() {
		orderTableRef && orderTableRef.loadOrders();
		orderListRef && orderListRef.loadOrders();
	}

	async function handleSync() {
		isSyncInProgress = true;
		await syncOrders();
		await loadOrders();
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
							<h1 class="text-xl font-black dark:text-base-200">Orders</h1>
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
								onClick={handleCreateOrder}
								label="Create Order"
								className="w-full sm:w-auto"
							/>
						</div>
					</div>
					<div class="m-4 p-4 bg-white dark:bg-base-800 shadow rounded-lg">
						{#if screenSize.isSm || screenSize.isMd || screenSize.isXs}
							<OrderList bind:this={orderListRef} />
						{:else}
							<OrderTable bind:this={orderTableRef} />
						{/if}
					</div>
				</div>
			</main>
		</BackgroundGradient>
	</ContentArea>
</div>
