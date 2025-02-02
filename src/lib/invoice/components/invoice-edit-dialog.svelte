<script lang="ts">
	import { TextField, type DialogExports} from '@cloudparker/moldex.js';
	import type { InvoiceDataModel } from '../invoice-types';
	import { nanoid } from 'nanoid';
	import { createInvoice, getInvoice, syncInvoices, updateInvoice } from '../invoice-service';

	type Props = {
		invoice?: InvoiceDataModel;
	};

	let { invoice, closeDialog, setResult, setOkSpinner, setOkEnabled }: Props & DialogExports =
		$props();

    let invoiceNo:string = $state(invoice?.invoiceNo || nanoid())
    let amount:string = $state(invoice?.amount || '$50')

    async function handleSubmit(ev: SubmitEvent) {
		ev.preventDefault();

		amount = (amount || '').trim();

		if (invoiceNo) {
			try {
				setOkSpinner(true);
				setOkEnabled(false);
				let id = null;
				let payload = { invoiceNo, amount };
				if (invoice?._id) {
					id = await updateInvoice(invoice?._id, payload);
				} else {
					id = await createInvoice(payload);
				}
				if (id) {
					await syncInvoices();
					let res = await getInvoice(id);
					closeDialog(res);
				}
			} catch (error) {
				console.error(error);
			} finally {
				setOkSpinner(false);
				setOkEnabled(true);
			}
		}
	}
</script>

<form id="invoice-edit-form" onsubmit={handleSubmit}>
	<div class="px-6">
		<div class="my-4">
			<TextField
				name="invice No"
				label="Invoice Number"
				required
				autofocus
				bind:value={invoiceNo}
			/>
		</div>

		<div class="my-4">
			<TextField name="amount" label="Amount" maxlength={100} bind:value={amount} />
		</div>
		
	</div>
</form>
