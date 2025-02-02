<script lang="ts">
	import { Button, TextDate } from '@cloudparker/moldex.js';
	import { openInvoiceEditDialog } from '../invoice-ui-service';
	import type { InvoiceDataModel } from '../invoice-types';
	import { getAllInvoices } from '../invoice-service';
	import { onMount } from 'svelte';

	let invoices: InvoiceDataModel[] = $state([]);
	async function handleCreateInvoice() {
		await openInvoiceEditDialog();
	}

	async function loadInvoices() {
		invoices = await getAllInvoices();
	}

	onMount(() => {
		loadInvoices();
	});
</script>

<div class="p-4">
	<div class="p-4 flex items-center justify-between">
		<div><h1 class="font-black text-base-800 dark:text-base-300">Billing Invoice</h1></div>
		<div>
			<Button appearance="border-base" onClick={handleCreateInvoice} label="Add" />
		</div>
	</div>
	<div class="overflow-x-auto">
		<table class="w-full">
			<thead class="bg-base-50 dark:bg-base-800 text-base-800 dark:text-base-300">
				<tr>
					<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
						>Invoice No</th
					>
					<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
					<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Amount</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-base-200 dark:divide-base-700">
				{#each invoices as invoice, index}
					<tr class="hover:bg-base-50 dark:hover:bg-base-600 text-base-800 dark:text-base-300">
						<td class="px-6 py-4 text-sm">{invoice.invoiceNo}</td>
						<td class="px-6 py-4 text-sm"><span><TextDate input={invoice.cat || ''} /></span></td>
						<td class="px-6 py-4 text-sm">{invoice.amount || ''}</td>

						<!-- <td class="px-6 py-4 text-sm">${invoice.amount.toFixed(2)}</td> -->
						<!-- <td class="px-6 py-4 text-sm">
								{#if invoice.status === 'Paid'}
									<span
										class="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full"
										>Paid</span
									>
								{:else if invoice.status === 'Pending'}
									<span
										class="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full"
										>Pending</span
									>
								{:else}
									<span class="px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full"
										>Overdue</span
									>
								{/if}
							</td> -->
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
