<script lang="ts">
	import { TextField, type DialogExports } from '@cloudparker/moldex.js';
	import { CallStatusEnum, CallTypeEnum, type CallDataModel } from '../call-types';
	import { serverTimestamp } from 'firebase/firestore';
	import { createCall, getCall, syncCalls, updateCall } from '../call-service';

	type Props = {
		call?: CallDataModel;
	};

	let { call, closeDialog, setResult, setOkSpinner, setOkEnabled }: DialogExports & Props =
		$props();

	let from: string = $state(call?.from || '');
	let to: string = $state(call?.to || '');

	async function handleSubmit(ev: SubmitEvent) {
		ev.preventDefault();

		if (from && to) {
			try {
				setOkSpinner(true);
				setOkEnabled(false);
				let id = null;
				let payload :CallDataModel= {
					type: CallTypeEnum.PHONE,
					from,
					to,
					meter: 1,
					pricing: { call: 0.1, phone: 0.01, chat: 0.1 },
					date: serverTimestamp(),
					status: CallStatusEnum.RINGING
				};
				if (call?._id) {
					id = await updateCall(call?._id, payload);
				} else {
					id = await createCall(payload);
				}
				if (id) {
					await syncCalls();
					let res = await getCall(id);
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

<form id="call-edit-form" onsubmit={handleSubmit}>
	<div class="px-6">
		<div class="my-4">
			<TextField name="from" label="From" bind:value={from} />
		</div>
		<div class="my-4">
			<TextField name="to" label="To" bind:value={to} />
		</div>
	</div>
</form>
