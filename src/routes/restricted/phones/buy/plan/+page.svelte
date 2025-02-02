<script lang="ts">
	import { page } from '$app/stores';
	import AppNavbar from '$lib/core/components/app-navbar.svelte';
	import BackgroundGradient from '$lib/core/components/background-gradient.svelte';
	import RestrictedDrawer from '$lib/drawer/components/restricted-drawer.svelte';
	import MonthlyPricingCard from '$lib/phone/components/phone-pricing-card-monthly.svelte';
	import YearlyPricingCard from '$lib/phone/components/phone-pricing-card-yearly.svelte';
	import { getSelectedPhoneNumber } from '$lib/phone/phone-state.svelte';
	import type { PhonePlivoData } from '$lib/phone/phone-types';
	import { ContentArea, Drawer, goBack, isMobileScreen, navigate, Sidebar } from '@cloudparker/moldex.js';
	import { onMount } from 'svelte';

	let drawerRef: Drawer;

	let selectedPhoneNumber: PhonePlivoData | null = $state(getSelectedPhoneNumber());

	// Extract query params on component mount
	onMount(() => {
		if (!selectedPhoneNumber) {
			navigate('/restricted/phones/buy');
		}
	});
</script>

<div class="min-h-full">
	<AppNavbar hasLogo hasTitle hasBack={isMobileScreen()} onBack={goBack}/>
	<Drawer bind:this={drawerRef} className="border-r">
		<RestrictedDrawer />
	</Drawer>
	<Sidebar className="border-r">
		<RestrictedDrawer />
	</Sidebar>
	<ContentArea className="md:pl-72">
		<BackgroundGradient>
			<main class="pb-16">
				<div class="p-6 md:p-8 flex justify-between">
					<div class="text-base-800 dark:text-base-300">
						<h1 class="text-2xl font-black">+{selectedPhoneNumber?.number}</h1>
						<!-- <p class="text-lg">Region: {region}</p> -->
						<p class="text-lg text-base-600 dark:text-base-300">Purchase Price: $7.00 (One Time)</p>
						<p class="text-lg text-base-600 dark:text-base-300">
							Monthly Rent: ${selectedPhoneNumber?.monthly_rental_rate}
						</p>
						<p class="text-lg text-base-600 dark:text-base-300">
							Voice Rate: ${selectedPhoneNumber?.voice_rate}/min
						</p>
						<!-- <p class="text-lg">Type: {type}</p> -->
					</div>
					<!-- Uncomment if needed -->
					<!-- <div>
						<AccountBalanceCard />
					</div> -->
				</div>

				<div class="flex flex-col md:flex-row gap-6 md:gap-8 items-center justify-center">
					<div class="w-full max-w-xs">
						<MonthlyPricingCard
							phoneNumber={selectedPhoneNumber?.number || ''}
							monthlyRentalRate={selectedPhoneNumber?.monthly_rental_rate || 0}
							voiceRate={selectedPhoneNumber?.voice_rate || ''}
						/>
					</div>
					<div class="w-full max-w-xs">
						<YearlyPricingCard
							phoneNumber={selectedPhoneNumber?.number || ''}
							yearlyRentalRate={selectedPhoneNumber?.yearly_rental_rate || 0}
							voiceRate={selectedPhoneNumber?.voice_rate || ''}
						/>
					</div>
				</div>
			</main>
		</BackgroundGradient>
	</ContentArea>
</div>
