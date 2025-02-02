<script lang="ts">
	import AppNavbar from '$lib/core/components/app-navbar.svelte';
	import BackgroundGradient from '$lib/core/components/background-gradient.svelte';
	import RestrictedDrawer from '$lib/drawer/components/restricted-drawer.svelte';
	import { Button, ContentArea, Drawer, isMobileScreen, Sidebar } from '@cloudparker/moldex.js';
	import AccountBalanceCard from '$lib/billing/components/account-balance-card.svelte';
	import { BillingTabsEnum } from '$lib/billing/billing-service';
	import InvoiceList from '$lib/invoice/components/invoice-list.svelte';
	import PaymentReceiptList from '$lib/payment/components/payment-receipt-list.svelte';
	import OrgBillingAddressCard from '$lib/org/components/org-billing-address-card.svelte';

	let drawerRef: Drawer;

	let selectedTab: BillingTabsEnum = $state(BillingTabsEnum.INVOICE);

	function handleMore() {
		drawerRef && drawerRef.openDrawer();
	}

	function handleAdd() {}
</script>

<div class="min-h-full">
	<AppNavbar hasLogo hasTitle hasMore={isMobileScreen()} onMore={handleMore}/>
	<Drawer bind:this={drawerRef} className="border-r"><RestrictedDrawer /></Drawer>
	<Sidebar className="border-r "><RestrictedDrawer /></Sidebar>
	<ContentArea className="md:pl-72">
		<BackgroundGradient>
			<main class="pb-16">
				<div class="p-4 sm:p-6 md:p-8 flex items-center justify-between">
					<div><h1 class="text-xl font-black text-base-800 dark:text-base-300">Billing</h1></div>
					<!-- <div>
						<Button appearance="border-primary" onClick={handleAdd} label="ADD" />
					</div> -->
				</div>
				<div class="m-4 sm:m-8">
					<div class="flex flex-col md:flex-row gap-6">
						<div class="w-full md:w-auto ">
							<AccountBalanceCard />
						</div>
						<div class="w-full md:w-auto ">
							<OrgBillingAddressCard />
						</div>
					</div>
				</div>

				<div class="m-4 sm:m-8 bg-white dark:bg-base-800 rounded-sm shadow-lg">
					<div class="flex flex-wrap gap-4 p-4 sm:p-6">
						<Button
							label="INVOICE"
							appearance={selectedTab == BillingTabsEnum.INVOICE ? 'border-primary' : 'none'}
							onClick={() => (selectedTab = BillingTabsEnum.INVOICE)}
						/>
						<Button
							label="PAYMENT RECEIPT"
							appearance={selectedTab == BillingTabsEnum.PAYMENT_RECEIPT
								? 'border-primary'
								: 'none'}
							onClick={() => (selectedTab = BillingTabsEnum.PAYMENT_RECEIPT)}
						/>
					</div>
					<hr />
					<div class="overflow-x-auto">
						{#if selectedTab == BillingTabsEnum.INVOICE}
							<InvoiceList />
						{:else if selectedTab == BillingTabsEnum.PAYMENT_RECEIPT}
							<PaymentReceiptList />
						{:else}
							<div class="py-16 text-center text-base-400 dark:text-base-300 font-light text-sm">
								You can view invoice or cach receipt here!
							</div>
						{/if}
					</div>
				</div>
			</main>
		</BackgroundGradient>
	</ContentArea>
</div>
