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
	import type { CustomerDataModel } from '$lib/user/user-types';
	import { openCustomerEditDialog } from '$lib/user/customer-ui-service';
	import { getAllUsers, getUser, UserTypeEnum } from '$lib/user/user-service';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import CustomerDetails from '$lib/user/components/customer-details.svelte';
	import MasterDetails from '$lib/user/components/master-details.svelte';
	import CustomerBillingDetails from '$lib/user/components/customer-billing-details.svelte';
	import CustomerDeliveryDetails from '$lib/user/components/customer-delivery-details.svelte';
	import CustomerOwnerDetails from '$lib/user/components/customer-owner-details.svelte';
	import CustomerGeographicalDetails from '$lib/user/components/customer-geographical-details.svelte';

	let drawerRef: Drawer;

	let customerId: string = $derived(page.url.searchParams.get('customerId') || '');
	let customer: CustomerDataModel | null = $state(null);

	function handleMore() {
		drawerRef && drawerRef.openDrawer();
	}

	async function loadCustomers() {
		if (customerId) {
			customer = await getUser(customerId);
		} else {
			customer = null;
		}
	}

	async function handleEdit() {
		if (customer) {
			let res = await openCustomerEditDialog(customer);
			if (res) {
				loadCustomers();
			}
		}
	}

	onMount(() => {
		loadCustomers();
	});
</script>

<div class="min-h-full">
	<AppNavbar title="VIEW CUSTOMER" hasLogo hasTitle hasBack={isMobileScreen()} onBack={goBack} />
	<Drawer bind:this={drawerRef} className="border-r"><RestrictedDrawer /></Drawer>
	<Sidebar className="border-r "><RestrictedDrawer /></Sidebar>
	<ContentArea className="md:pl-72">
		<BackgroundGradient>
			<main>
				<div class="p-4 flex items-center justify-between">
					<div><h1 class="text-xl font-black">Customer Details</h1></div>
					<div>
						<Button appearance="border-primary" onClick={handleEdit} label="Edit" />
					</div>
				</div>
				<div class="pb-32">
					{#if customer != null}
					<div class="bg-white p-4 shadow rounded-lg m-4">
						<CustomerDetails {customerId}/>
					</div>
					<div class="bg-white p-4 shadow rounded-lg m-4">
						<MasterDetails {customerId}/>
					</div>
					<div class="bg-white p-4 shadow rounded-lg m-4">
						<CustomerBillingDetails {customerId}/>
					</div>
					<div class="bg-white p-4 shadow rounded-lg m-4">
						<CustomerDeliveryDetails {customerId}/>
					</div>
					<div class="bg-white p-4 shadow rounded-lg m-4">
						<CustomerOwnerDetails {customerId}/>
					</div>
					<div class="bg-white p-4 shadow rounded-lg m-4">
						<CustomerGeographicalDetails {customerId}/>
					</div>
					{/if}
				</div>
			</main>
		</BackgroundGradient>
	</ContentArea>
</div>
