<script lang="ts">
	import { createUser, getUser, syncUsers, updateUser } from '$lib/user/user-service';
	import type { CustomerDataModel } from '$lib/user/user-types';
	import {
		EmailField,
		PhoneField,
		showToast,
		TextareaField,
		TextField,
		type DialogExports
	} from '@cloudparker/moldex.js';

	export type CustomerProps = {
		customer?: CustomerDataModel;
	};

	let {
		customer = {},
		setOkEnabled,
		setOkSpinner,
		closeDialog,
		setResult
	}: DialogExports & CustomerProps = $props();

	let name = $state(customer?.name || '');
	let desc = $state(customer?.desc || '');
	let email = $state(customer?.email || '');
	let phone = $state(customer?.phone || '');
	let altPhone = $state(customer?.altPhone || '');
	let address = $state(customer?.address || '');

	let billingName = $state(customer?.billing?.name || '');
	let billingAddress = $state(customer?.billing?.address || '');
	let billingEmail = $state(customer?.billing?.email || '');
	let billingPhone = $state(customer?.billing?.phone || '');
	let billingTaxNo = $state(customer?.billing?.taxNo || '');

	async function handleSubmit(ev: SubmitEvent) {
		ev.preventDefault();
		name = (name || '').trim();
		desc = (desc || '').trim();
		email = (email || '').trim();
		phone = (phone || '').trim();
		altPhone = (altPhone || '').trim();
		address = (address || '').trim();

		billingName = (billingName || '').trim();
		billingAddress = (billingAddress || '').trim();
		billingEmail = (billingEmail || '').trim();
		billingPhone = (billingPhone || '').trim();
		billingTaxNo = (billingTaxNo || '').trim();

		let payload = { name, desc, email, phone, altPhone, address };

		if (name) {
			setOkEnabled(false);
			setOkSpinner(true);

			let id = null;
			if (!customer?._id) {
				id = await createUser(payload);
			} else {
				id = await updateUser(customer?._id, payload);
			}
			if (id) {
				await syncUsers();
				let customer = getUser(id);
				setResult(customer);
			}

			closeDialog();
		} else {
			showToast({ msg: 'Please fill the required fields' });
		}
	}
</script>

<form id="customer-edit-form" onsubmit={handleSubmit}>
	<div class="px-6">
		<div class="my-4">
			<TextField
				name="name"
				label="Customer name"
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
		<div class="my-4">
			<TextField
				name="altPhone"
				label="Alternet Phone Number"
				bind:value={altPhone}
				maxlength={18}
			/>
		</div>
		<div class="my-4">
			<TextareaField name="address" label="Address" bind:value={address} maxlength={300} />
		</div>
	</div>
	<div class="px-6">
		<div class="my-6 bg-primary-50">
			<h5 class="text-lg px-4 py-2 font-bold text-primary">Billing</h5>
			<hr class="border-primary" />
		</div>
		<div class="my-4">
			<TextField name="Billing Name" label="Billing Name" bind:value={billingName} maxlength={80} />
		</div>
		<div class="my-4">
			<TextareaField
				name="billingAddress"
				label="Billing Address"
				bind:value={billingAddress}
				maxlength={300}
			/>
		</div>
		<div class="my-4">
			<TextField
				name="billingEmail"
				label="Billing Email"
				bind:value={billingEmail}
				maxlength={80}
			/>
		</div>
		<div class="my-4">
			<TextField
				name="billingPhone"
				label="Billing Phone"
				bind:value={billingPhone}
				maxlength={18}
			/>
		</div>
		<div class="my-4">
			<TextField
				name="billingTaxNo"
				label="Billing Tax No / GST No"
				bind:value={billingTaxNo}
				maxlength={50}
			/>
		</div>
	</div>
</form>
