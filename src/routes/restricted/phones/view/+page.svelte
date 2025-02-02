<script lang="ts">
	import AppNavbar from '$lib/core/components/app-navbar.svelte';
	import BackgroundGradient from '$lib/core/components/background-gradient.svelte';
	import RestrictedDrawer from '$lib/drawer/components/restricted-drawer.svelte';
	import { ContentArea, Drawer, goBack, isMobileScreen, Sidebar } from '@cloudparker/moldex.js';
	import { page } from '$app/state';
	import PhoneDetailsCard from '$lib/phone/components/phone-details-card.svelte';

	let drawerRef: Drawer;

	let phoneId = $derived(page.url.searchParams.get('phonId') || '');
</script>

<div class="min-h-full">
	<AppNavbar hasLogo hasTitle hasBack={isMobileScreen()} onBack={goBack}/>
	<Drawer bind:this={drawerRef} className="border-r"><RestrictedDrawer /></Drawer>
	<Sidebar className="border-r "><RestrictedDrawer /></Sidebar>
	<ContentArea className="md:pl-72">
		<BackgroundGradient>
			<main>
				<div class="p-6 md:p-8 flex items-center justify-between">
					<div class="text-center md:text-left">
						<h1 class="text-lg md:text-xl font-black text-base-800 dark:text-base-300">
							Phone Numbers Details
						</h1>
					</div>
				</div>

				<div class="mx-4 md:mx-8">
					<PhoneDetailsCard {phoneId} />
				</div>
			</main>
		</BackgroundGradient>
	</ContentArea>
</div>
