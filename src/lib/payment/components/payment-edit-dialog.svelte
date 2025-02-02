<script lang="ts">
	import { NumberField, TextField, type DialogExports } from '@cloudparker/moldex.js';
	import {
		createPayment,
		getPayment,
		PaymentStatusEnum,
		syncPayments,
		updatePayment
	} from '../payment-service';
	import type { PaymentDataModel } from '../payment-types';
	import { serverTimestamp } from 'firebase/firestore';

	type Props = {
		payment?: PaymentDataModel;
	};

	let { payment, closeDialog, setResult, setOkSpinner, setOkEnabled }: Props & DialogExports =
		$props();

	let amount: number = $state(payment?.amount || 0);

	async function handleSubmit(ev: SubmitEvent) {
		ev.preventDefault();

		amount = amount || 0;

		if (amount) {
			try {
				setOkSpinner(true);
				setOkEnabled(false);
				let id = null;
				let payload = { amount, status: PaymentStatusEnum.PENDING, date: serverTimestamp() };
				if (payment?._id) {
					id = await updatePayment(payment?._id, payload);
				} else {
					id = await createPayment(payload);
				}
				if (id) {
					await syncPayments();
					let res = await getPayment(id);
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

<form id="payment-edit-form" onsubmit={handleSubmit}>
	<div class="px-6">
		<div class="my-4">
			<NumberField name="amount" label="Amount ($)" max={100000} bind:value={amount} />
		</div>
	</div>
</form>
