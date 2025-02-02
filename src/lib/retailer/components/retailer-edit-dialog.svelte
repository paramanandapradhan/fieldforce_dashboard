<script lang="ts">
	import {
		EmailField,
		PhoneField,
		showToast,
		TextField,
		type DialogExports
	} from '@cloudparker/moldex.js';
	import type { RetailerDataModel } from '../retailer-types';
	import { createRetailer, getRetailer, syncRetailers, updateRetailer } from '../retailer-service';

	export type RetailerProps = {
		retailer?: RetailerDataModel;
	};

	let {
		retailer = {},
		setOkEnabled,
		setOkSpinner,
		closeDialog,
		setResult
	}: DialogExports & RetailerProps = $props();

	let name = $state(retailer?.name || '');
	let desc = $state(retailer?.desc || '');
	let email = $state(retailer?.email || '');
	let phone = $state(retailer?.phone || '');

	async function handleSubmit(ev: SubmitEvent) {
		ev.preventDefault();
		name = (name || '').trim();
		desc = (desc || '').trim();
		email = (email || '').trim();
		phone = (phone || '').trim();
		if (name) {
			setOkEnabled(false);
			setOkSpinner(true);

			let payload = { name, desc, email, phone };

			let id = null;
			if (!retailer?._id) {
				id = await createRetailer(payload);
			} else {
				id = await updateRetailer(retailer?._id, payload);
			}
			if (id) {
				await syncRetailers();
				let retailer = getRetailer(id);
				setResult(retailer);
			}

			closeDialog();
		} else {
			showToast({ msg: 'Please fill the required fields' });
		}
	}
</script>

<form id="retailer-edit-form" onsubmit={handleSubmit}>
	<div class="px-6">
		<div class="my-4">
			<TextField
				name="name"
				label="Retailer name"
				maxlength={50}
				bind:value={name}
				required
				autofocus
			/>
		</div>
		<div class="my-4">
			<TextField name="desc" label="Description" maxlength={100} bind:value={desc} />
		</div>
		<div class="my-4">
			<EmailField name="email" label="Email" bind:value={email} />
		</div>
		<div class="my-4">
			<PhoneField name="phone" label="Phone" bind:value={phone} dialCode="+91" />
		</div>
	</div>
</form>
