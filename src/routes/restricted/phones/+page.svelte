<script lang="ts">
	import { goto } from '$app/navigation';
	import AppNavbar from '$lib/core/components/app-navbar.svelte';
	import BackgroundGradient from '$lib/core/components/background-gradient.svelte';
	import RestrictedDrawer from '$lib/drawer/components/restricted-drawer.svelte';
	import PhoneList from '$lib/phone/components/phone-list.svelte';
	import { resetPhoneNumbersStates } from '$lib/phone/phone-state.svelte';

	import { Button, ContentArea, Drawer, Icon, isMobileScreen, mdiPhone, Sidebar } from '@cloudparker/moldex.js';

	let drawerRef: Drawer;
	let phoneListRef: PhoneList;

	function handleMore() {
		drawerRef && drawerRef.openDrawer();
	}

	async function handleBuyPhoneNumber() {
		resetPhoneNumbersStates();
		goto('restricted/phones/buy');
	}
</script>

<div class="min-h-full">
	<AppNavbar hasLogo hasTitle hasMore={isMobileScreen()} onMore={handleMore}/>
	<Drawer bind:this={drawerRef} className="border-r"><RestrictedDrawer /></Drawer>
	<Sidebar className="border-r "><RestrictedDrawer /></Sidebar>
	<ContentArea className="md:pl-72">
		<BackgroundGradient>
			<main>
				<div class="p-4 sm:p-6 md:p-8 flex items-center justify-between">
					<h1 class="text-lg sm:text-xl font-black text-base-800 dark:text-base-300">
						Phone Numbers
					</h1>
				</div>
				<div class="mx-4 sm:mx-6 md:mx-8 mb-6 sm:mb-8">
					<div class="bg-white dark:bg-base-700 rounded-2xl md:rounded-3xl p-4 sm:p-6">
						<p
							class="text-xs sm:text-sm text-base-500 dark:text-base-300 font-light leading-relaxed"
						>
							Our AI-powered voice agent is an advanced, customizable solution designed to enhance
							user interactions through seamless voice communication. Equipped with a dynamic
							knowledge base that can handle domain-specific, general, and custom information, the
							agent adapts to various industries and needs. It supports multiple languages,
							including English, Spanish, French, German, Mandarin Chinese, and Hindi, with natural,
							high-quality voices available in male, female, and non-binary options. The agent can
							perform tasks such as answering queries, booking appointments, processing
							transactions, and providing personalized recommendations. With flexible pricing plans
							and a focus on security and privacy, this voice agent ensures a superior and
							user-friendly experience for businesses and their customers.
						</p>
					</div>
				</div>
				<div class="mx-4 sm:mx-6 md:mx-8 mt-4 sm:mt-16 mb-4 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
					<!-- Heading -->
					<h3 class="text-md sm:text-lg text-base font-bold text-base-800 dark:text-base-300 order-1">
						Active Phone Numbers
					</h3>
				
					<!-- Button -->
					<Button 
						appearance="border-primary" 
						onClick={handleBuyPhoneNumber} 
						className="w-full sm:w-auto order-2  mt-4 sm:mt-0"
					>
						<Icon path={mdiPhone} />
						<span>Buy a Phone Number</span>
					</Button>
				</div>
				
				<div class="mx-4 sm:mx-6 md:mx-8">
					<PhoneList bind:this={phoneListRef} />
				</div>
				<div class="mx-4 sm:mx-6 md:mx-8 !h-8">
					<div></div>
				</div>
			</main>
		</BackgroundGradient>
	</ContentArea>
</div>
