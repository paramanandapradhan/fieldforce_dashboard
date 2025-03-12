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
	import { getAllUsers, UserTypeEnum } from '$lib/user/user-service';
	import type { CustomerDataModel } from '$lib/user/user-types';
	import { openUserPickerDialog } from '$lib/user/user-ui-service';
	import { openAddToCartDialog } from '$lib/product/product-ui-service';

	let drawerRef: Drawer;

	function handleMore() {
		drawerRef && drawerRef.openDrawer();
	}

	async function handleCreateOrder() {
		let customer =
			((await openUserPickerDialog({
				userType: UserTypeEnum.USER_TYPE_CUSTOMER
			})) as CustomerDataModel) || null;
		if (customer) {
			console.log('customer', customer);
			await openAddToCartDialog();
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
					<div><h1 class="text-xl font-black">Orders</h1></div>
					<div>
						<Button appearance="border-primary" onClick={handleCreateOrder} label="Create Order" />
					</div>
				</div>
			</main>
		</BackgroundGradient>
	</ContentArea>
</div>
