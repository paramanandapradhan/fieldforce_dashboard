<script lang="ts">
	import AppNavbar from '$lib/core/components/app-navbar.svelte';
	import BackgroundGradient from '$lib/core/components/background-gradient.svelte';
	import LoadingAnimatePulse from '$lib/core/components/loading-animate-pulse.svelte';
	import RestrictedDrawer from '$lib/drawer/components/restricted-drawer.svelte';
	import { searchPhoneNumber } from '$lib/phone/phone-service';
	import {
		getBoughtPhoneNumber,
		getPhoneNumbers,
		getSelectedPhoneNumber,
		setPhoneNumbers,
		setSelectedPhoneNumber
	} from '$lib/phone/phone-state.svelte';
	import type { PhonePlivoData } from '$lib/phone/phone-types';
	import { Button, ContentArea, Drawer, goBack, isMobileScreen, navigate, Sidebar } from '@cloudparker/moldex.js';
	import { onMount } from 'svelte';

	let drawerRef: Drawer;
	let selectedCountry: string = 'IN';
	let selectedType: string = 'local';
	let searchPattern: string = '';
	let offset: number = 0;

	let phoneNumbers: PhonePlivoData[] = $state(getPhoneNumbers());

	let isLoading: boolean = $state(false);

	function handleMore() {
		drawerRef && drawerRef.openDrawer();
	}

	function handleAdd() {}

	function handleBuyPhoneNumber(phone: PhonePlivoData) {
		setSelectedPhoneNumber(phone);
		if (phone?.number) {
			navigate(`/restricted/phones/buy/plan`);
		}
	}

	async function handleSearchPhoneNumber() {
		isLoading = true;
		let numbers = [];
		try {
			if (searchPattern) {
				numbers = await searchPhoneNumber(selectedCountry, selectedType, searchPattern, offset);
			} else {
				let phoneNumbers1 = await searchPhoneNumber(selectedCountry, selectedType, '2', offset);
				let phoneNumbers2 = await searchPhoneNumber(selectedCountry, selectedType, '8', offset);
				numbers = [...phoneNumbers1, ...phoneNumbers2];
			}

			phoneNumbers = numbers;
			setPhoneNumbers(numbers);

			console.log(phoneNumbers); // Optional: Check the fetched numbers
		} catch (error) {
			console.error('Error fetching phone numbers:', error);
		} finally {
			isLoading = false;
		}
	}

	onMount(() => {
		let boughtPhoneNumber = getBoughtPhoneNumber();
		let selectedPhoneNumber = getSelectedPhoneNumber();

		console.log('boughtPhoneNumber', boughtPhoneNumber, selectedPhoneNumber);

		if (boughtPhoneNumber?.number && boughtPhoneNumber?.number == selectedPhoneNumber?.number) {
			goBack();
		} else if (!phoneNumbers?.length) {
			handleSearchPhoneNumber();
		}
	});
</script>

<div class="min-h-full">
	<AppNavbar hasLogo hasTitle hasBack={isMobileScreen()} onBack={goBack}/>
	<Drawer bind:this={drawerRef} className="border-r"><RestrictedDrawer /></Drawer>
	<Sidebar className="border-r "><RestrictedDrawer /></Sidebar>
	<ContentArea className="md:pl-72">
		<BackgroundGradient>
			<main>
				<div class="p-6 text-center md:text-left">
					<h1 class="text-xl font-black text-base-800 dark:text-base-300">Buy Phone Number</h1>
				</div>
				<!-- <div class=" flex justify-center">
					<ComboboxField bind:value={selectedCountry} items={[{_id:'IN', name:'India'}]}>

					</ComboboxField>
					
				</div> -->

				<!-- <div class="flex gap-8 justify-center my-8 mx-6">
					<RadioField
						bind:value={selectedType}
						direction="horizontal"
						labelClassName="text-primary"
						items={[
							{ value: 'local', label: 'Local Number' },
							// { value: 'tollfree', label: 'Tollfree Number' }
						]}
					/>
				</div> -->

				<!-- <div class="flex justify-center my-12">
					
					<Button
						appearance="border-primary"
						size="lg"
						className="!rounded-full"
						onClick={searchPhoneNumber}
					>
						<Icon path={mdiMagnify} />
						<p>Search</p>
					</Button>
				</div> -->

				{#if isLoading}
					<div class="m-4 md:m-8 pb-16">
						{#each Array(5) as _, index}
							<div
								class="flex items-center gap-8 justify-between bg-white dark:bg-base-700 text-base-800 dark:text-base-300 shadow-lg rounded-lg p-8 my-4"
							>
								<LoadingAnimatePulse />
							</div>
						{/each}
					</div>
				{:else}
					<div class="m-4 md:m-8 pb-16">
						{#each phoneNumbers as phone}
							<div
								class="flex flex-col md:flex-row items-center gap-6 md:gap-8 justify-between bg-white dark:bg-base-700 text-base-800 dark:text-base-300 shadow-lg rounded-lg p-6 md:p-8 my-4"
							>
								<div class="text-center md:text-left">
									<p class="text-3xl font-bold">+{phone.number}</p>
									<!-- <p>Region: {phone.region}</p> -->
									<p class="font-semibold text-base-600 dark:text-base-300">
										Purchase Price: $7.00 <span class="text-base-500 dark:text-base-400"
											>(One Time)</span
										>
									</p>
									<p class="font-semibold text-base-600 dark:text-base-300">
										Monthly Rent: ${phone.monthly_rental_rate}
									</p>
									<p class="font-semibold text-base-600 dark:text-base-300">
										Voice Rate: ${phone.voice_rate}/min
									</p>
									<!-- <p>Type: {phone.type}</p> -->
								</div>

								<Button
									appearance="border-primary"
									onClick={() => handleBuyPhoneNumber(phone)}
									className="w-full md:w-auto"
								>
									BUY
								</Button>
							</div>
						{/each}
					</div>
				{/if}
			</main>
		</BackgroundGradient>
	</ContentArea>
</div>
