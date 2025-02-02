<script lang="ts">
	import { getAccountBalance } from '$lib/org/org-service';
	import { openPaymentEditDialog } from '$lib/payment/payment-ui-service';
	import { Button, TextCurrency } from '@cloudparker/moldex.js';
	import { onMount } from 'svelte';

	let balance: number = $state(0);

	async function handleLoadBalance() {
		await openPaymentEditDialog();
		await loadBalance();
	}

	export async function loadBalance() {
		balance = (await getAccountBalance()) || 0;
	}

	onMount(async () => {
		loadBalance();
	});
	
</script>

<div class="bg-white dark:bg-base-800 text-base-800 dark:text-base-300 rounded-xl p-4 sm:p-6 lg:p-10 min-w-72 w-full mx-auto">
	<div class="text-center">
		<h3 class="text-lg font-light text-base-500 dark:text-base-300">BALANCE</h3>
	</div>
	<div class="mt-2 text-center text-3xl font-black">
		<TextCurrency input={balance} hasSymbol symbol="$" />
	</div>
	<div class="mt-8 flex justify-center">
		<Button
			appearance="border-primary"
			label="LOAD BALANCE"
			className="w-full sm:w-auto"
			onClick={handleLoadBalance}
		/>
	</div>
</div>
