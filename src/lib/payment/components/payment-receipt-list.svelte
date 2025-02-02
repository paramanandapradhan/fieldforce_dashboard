<script lang="ts">
	import { Button, ButtonMenu, TextDate } from '@cloudparker/moldex.js';
	import type { PaymentDataModel } from '../payment-types';
	import { openPaymentEditDialog } from '../payment-ui-service';
	import { getAllPayments, PaymentStatusEnum, updatePayment } from '../payment-service';
	import { onMount } from 'svelte';
	import { update } from 'firebase/database';

	let paymentReceipts: PaymentDataModel[] = $state([]);
	async function handleCreatePayment() {
		await openPaymentEditDialog();
	}

	async function loadPaymentsList() {
		paymentReceipts = await getAllPayments();
	}

	function handlePaymentSuccess(payment: PaymentDataModel) {
		if (payment?._id) {
			updatePayment(payment._id, { status: PaymentStatusEnum.SUCCESS });
		}
	}

	onMount(() => {
		loadPaymentsList();
	});
</script>

<div class="p-4">
	<div class="p-4 flex items-center justify-between">
		<div><h1 class="font-black text-base-800 dark:text-base-300">Payment Receipts</h1></div>
		<div>
			<Button appearance="border-base" onClick={handleCreatePayment} label="Add" />
		</div>
	</div>
	<div class="overflow-x-auto">
		<table class="w-full">
			<thead class="bg-base-50 dark:bg-base-800 text-base-800 dark:text-base-300">
				<tr>
					<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"> ID</th>
					<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
					<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Amount</th>
					<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"> Status </th>
					<th></th>
				</tr>
			</thead>
			<tbody class="divide-y divide-base-200 dark:divide-base-700">
				{#each paymentReceipts as payment, index}
					<tr class="hover:bg-gray-50 dark:hover:bg-base-700 text-base-800 dark:text-base-300">
						<td class="px-6 py-4 text-sm">{payment._id}</td>
						<td class="px-6 py-4 text-sm"><span><TextDate input={payment.cat} /> </span></td>
						<td class="px-6 py-4 text-sm">{payment.amount}</td>
						<td class="px-6 py-4 text-sm">{payment?.status} </td>
						<td>
							<Button label="Payment Success" onClick={() => handlePaymentSuccess(payment)} />
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
