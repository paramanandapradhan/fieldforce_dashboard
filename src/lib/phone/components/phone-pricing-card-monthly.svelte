<script lang="ts">
	import { mdiCheck } from '$lib/core/services/app-icons-service';
	import { Button, goBack, Icon, showToast } from '@cloudparker/moldex.js';
	import { buyPhoneNumber, syncPhones } from '../phone-service';
	import { PhonePlans } from '../phone-types';
	import { setBoughtPhoneNumber } from '../phone-state.svelte';

	type Props = {
		monthlyRentalRate: number;
		voiceRate: string;
		phoneNumber: string;
	};

	let { monthlyRentalRate, voiceRate, phoneNumber }: Props = $props();

	async function handleBuyPhoneNumber(phoneNumber: string) {
		try {
			let phoneData = await buyPhoneNumber(phoneNumber, PhonePlans.MONTHLY);
			console.log('phoneData', phoneData);
			if (phoneData) {
				await syncPhones();
				showToast({ msg: 'Phone number bought successfully!' });
				setBoughtPhoneNumber(phoneData);
				goBack();
			} else {
				showToast({ msg: 'Fail to by new Phone number!' });
			}
		} catch (error) {
			console.log(error);
			showToast({ msg: 'Something went wrong. Please try later!' });
		}
	}
</script>

<div
	class="mx-auto min-w-72 shadow-lg rounded-lg text-base-800 dark:text-300 bg-base-100 dark:bg-base-800"
>
	<!-- <div class="bg-primary-500 text-white text-sm font-bold text-center py-2">Most Popular</div> -->

	<div class="px-6 py-4">
		<div class="font-bold text-xl mb-2 text-center text-base-800 dark:text-base-300">
			Monthly Plan
		</div>

		<p class="text-base-800 dark:text-base-300 text-2xl my-2 font-bold text-center">
			${monthlyRentalRate} <span class="text-sm text-base-500 dark:text-base-400">/month</span>
		</p>

		<p class="text-base-600 dark:text-base-400 text-center text-sm mb-4">
			Voice Rate: ${voiceRate}/min
		</p>

		<Button
			appearance="primary"
			label="Buy"
			className="w-full"
			onClick={() => handleBuyPhoneNumber(phoneNumber)}
		/>

		<ul class="my-8">
			<li class="flex items-center text-base-600 dark:text-base-400 text-sm mb-2">
				<Icon path={mdiCheck} className="text-green-500" />
				<span class="ms-2">24/7 Customer Support</span>
			</li>
			<li class="flex items-center text-base-600 dark:text-base-400 text-sm mb-2">
				<Icon path={mdiCheck} className="text-green-500" />
				<span class="ms-2">Uptime: 99.9%</span>
			</li>
			<li class="flex items-center text-base-600 dark:text-base-400 text-sm mb-2">
				<Icon path={mdiCheck} className="text-green-500" />
				<span class="ms-2">Calls Per Minute: 100</span>
			</li>
			<li class="flex items-center text-base-600 dark:text-base-400 text-sm mb-2">
				<Icon path={mdiCheck} className="text-green-500" />
				<span class="ms-2">Incoming/<span class="line-through">Outgoing</span></span>
			</li>
			<li class="flex items-center text-base-600 dark:text-base-400 text-sm mb-2">
				<Icon path={mdiCheck} className="text-green-500" />
				<span class="ms-2">Call Recording (30 days)</span>
			</li>
			<li class="flex items-center text-base-600 dark:text-base-400 text-sm mb-2">
				<Icon path={mdiCheck} className="text-green-500" />
				<span class="ms-2">Call Transcription (30 days)</span>
			</li>
		</ul>
	</div>
</div>
