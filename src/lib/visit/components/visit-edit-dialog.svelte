<script lang="ts">
	import {
		CheckboxField,
		NumberField,
		showToast,
		TextareaField,
		TextField,
		type DialogExports
	} from '@cloudparker/moldex.js';
	import type { VisitDataModel } from '../visite-type';
	import { createVisit, getVisit, syncVisits, updateVisit } from '../visit-service';
	import AttributeComboboxField from '$lib/attribute/components/attribute-combobox-field.svelte';
	import { AttributeTypeEnum } from '$lib/attribute/attribute-service';
	import CustomerComboboxField from '$lib/user/components/customer-combobox-field.svelte';
	import { UserTypeEnum } from '$lib/user/user-service';

	type Props = {
		visit?: VisitDataModel;
	};

	let { visit, closeDialog, setResult, setOkEnabled, setOkSpinner }: Props & DialogExports =
		$props();

	let name = $state(visit?.name || '');
	let desc = $state(visit?.desc || '');
	let customer = $state(visit?.customer || '');
	let type = $state(visit?.type || '');
	let isPlanned = $state(visit?.isPlanned || true);

	async function handleSubmit(ev: SubmitEvent) {
		ev.preventDefault();
		name = (name || '').trim();
		desc = (desc || '').trim();

		if (name && type) {
			setOkEnabled(false);
			setOkSpinner(true);
			let payload = {
				name,
				desc,
				customer,
				type,
				isPlanned
			};
			let id = null;
			if (!visit?._id) {
				id = await createVisit(payload);
			} else {
				id = await updateVisit(visit?._id, payload);
			}
			if (id) {
				await syncVisits();
				let visit = getVisit(id);
				setResult(visit);
			}
			closeDialog();
		} else {
			showToast({ msg: 'Please fill the required fields' });
		}
	}
</script>

<form id="visit-edit-form" onsubmit={handleSubmit}>
	<div class="px-6">
		<div class="my-4">
			<AttributeComboboxField
				attributeType={AttributeTypeEnum.TOUR_VISIT_TYPE}
				name="type"
				label="Type"
				bind:value={type}
				createButtonLabel="Add Tour Title"
				required
				autofocus
			/>
		</div>
		<div class="my-4">
			<TextField
				name="visit Title"
				label="Visit Purpose"
				maxlength={150}
				bind:value={name}
				required
			/>
		</div>
		<div class="my-4">
			<TextareaField name="desc" label="Visit Details" maxlength={250} bind:value={desc} />
		</div>
		<div class="my-4">
			<CustomerComboboxField
				userType={UserTypeEnum.USER_TYPE_CUSTOMER}
				name="Customer"
				label="Customer"
				bind:value={customer}
			/>
		</div>
		<div class="my-4">
			<CheckboxField name="isPlanned" label="Planned Visit" bind:value={isPlanned} />
		</div>
	</div>
</form>
