<script lang="ts">
	import { sanitizePhoneNumber, TextField, type DialogExports } from '@cloudparker/moldex.js';
	import type { PhoneDataModel } from '../phone-types';
	import { createPhone, getPhone, syncPhones, updatePhone } from '../phone-service';

	type Props = {
		phone?: PhoneDataModel;
	};

	let { phone, closeDialog, setOkEnabled, setOkSpinner }: DialogExports & Props = $props();

	let phoneNumber: string = $state(phone?.number || '');
	let desc: string = $state(phone?.desc || '');

	async function handleSubmit(ev: Event) {
		ev.preventDefault();
		phoneNumber = sanitizePhoneNumber((phoneNumber || '').trim());
		desc = (desc || '').trim();
		let payload: PhoneDataModel = { number: phoneNumber, desc };
		let id: string | null = null;
		setOkEnabled(false);
		setOkSpinner(true);
		try {
			if (phone?._id) {
				id = await updatePhone(phone._id, payload);
			} else {
				id = await createPhone(payload, payload.number);
			}
			if (id) {
				await syncPhones();
				let res = await getPhone(id);
				closeDialog(res);
			}
		} catch (error) {
			console.error(error);
		} finally {
			setOkEnabled(true);
			setOkSpinner(false);
		}
	}
</script>

<form id="phone-edit-form" onsubmit={handleSubmit}>
	<div class="mx-6">
		<div class="my-4">
			<TextField
				name="number"
				label="Phone number"
				bind:value={phoneNumber}
				required
				autofocus
				maxlength={20}
				disabled={!!phone?._id}
			/>
		</div>
		<div class="my-4">
			<TextField name="desc" label="Description" bind:value={desc} />
		</div>
	</div>
</form>
