<script lang="ts">
	import { TextareaField, TextField, type DialogExports } from '@cloudparker/moldex.js';
	import { getOrg, syncOrg, updateOrg } from '../org-service';
	import type { OrgDataModel } from '../org-types';

	type Props = {
		org?: OrgDataModel;
	};

	let { org, closeDialog, setResult, setOkSpinner, setOkEnabled }: Props & DialogExports = $props();

	let name: string = $state(org?.billing?.name || '');
	let address: string = $state(org?.billing?.address || '');
	let country: string = $state(org?.billing?.country || '');
	let email: string = $state(org?.billing?.email || '');
	let pincode: string = $state(org?.billing?.pincode || '');
	let phone: string = $state(org?.billing?.phone || '');

	async function handleSubmit(ev: SubmitEvent) {
		ev.preventDefault();

		name = (name || '').trim();
		address = (address || '').trim();
		country = (country || '').trim();
		email = (email || '').trim();
		pincode = (pincode || '').trim();
		phone = (phone || '').trim();

		if (name) {
			try {
				setOkSpinner(true);
				setOkEnabled(false);
				let payload: OrgDataModel = { billing: { name, address, country, email, pincode, phone } };

				if (org?._id) {
					await updateOrg(org._id, payload);
					org.billing = payload;
					const updatedOrg = org;
					closeDialog(updatedOrg);
				}
			} catch (error) {
				console.error(error);
			}
		}
	}
</script>

<div class="px-6 py-2">
	<form id="billing-edit-form" onsubmit={handleSubmit}>
		<div class="mb-2 mt-2">
			<TextField name="name" label="Billing Name" autofocus maxlength={50} bind:value={name} />
		</div>
		<div class="mb-2">
			<TextField name="email" label="Billing Email" maxlength={50} bind:value={email} />
		</div>
		<div class="mb-2">
			<TextField name="phone" label="Billing Phon No" maxlength={50} bind:value={phone} />
		</div>
		<div class="mb-2">
			<TextareaField name="address" label="Billing Address" maxlength={200} bind:value={address} />
		</div>
		<div class="mb-2">
			<TextField name="country" label="Country" maxlength={50} bind:value={country} />
		</div>
		<div class="mb-2">
			<TextField name="pincode" label="Pin Code" maxlength={50} bind:value={pincode} />
		</div>
	</form>
</div>
