<script lang="ts">
	import {
		CheckboxField,
		ComboboxField,
		DateField,
		EmailField,
		PhoneField,
		showToast,
		TextareaField,
		TextField,
		type DialogExports
	} from '@cloudparker/moldex.js';
	import { type UserDataModel } from '../user-types';
	import {
		createUser,
		getUser,
		syncUsers,
		updateUser,
		USER_SUBTYPES,
		UserSubtypeEnum,
		UserTypeEnum
	} from '../user-service';
	import AttributeComboboxField from '$lib/attribute/components/attribute-combobox-field.svelte';
	import { AttributeTypeEnum } from '$lib/attribute/attribute-service';
	import UserComboboxField from './user-combobox-field.svelte';
	import TeamComboboxField from '$lib/teams/components/team-combobox-field.svelte';

	type Props = {
		user?: UserDataModel;
	};

	let { user, closeDialog, setResult, setOkEnabled, setOkSpinner }: Props & DialogExports =
		$props();

	let name = $state(user?.name || '');
	let desc = $state(user?.desc || '');
	let email = $state(user?.email || '');
	let phone = $state(user?.phone || '');
	let dept = $state(user?.dept || '');
	let address = $state(user?.address || '');
	let subtype = $state(user?.subtype || UserSubtypeEnum.USER_SUBTYPE_USER_STAFF);
	let desig = $state(user?.desig || '');
	let manager = $state(user?.manager || '');
	let team = $state(user?.team || '');
	let dob = $state(user?.dob || '');
	let doj = $state(user?.doj || '');
	let isActive = $state(user?.isActive || true);
	let canOrder = $state(user?.canOrder || true);

	async function handleSubmit(ev: SubmitEvent) {
		ev.preventDefault();
		name = (name || '').trim();
		desc = (desc || '').trim();
		email = (email || '').trim();
		phone = (phone || '').trim();
		dept = (dept || '').trim();
		address = (address || '').trim();

		if (name && email) {
			setOkEnabled(false);
			setOkSpinner(true);
			let payload = {
				name,
				desc,
				email,
				phone,
				address,
				type: UserTypeEnum.USER_TYPE_USER,
				subtype,
				desig,
				manager,
				team,
				dept,
				dob,
				doj,
				isActive,
				canOrder
			};
			let id = null;
			if (!user?._id) {
				id = await createUser(payload);
			} else {
				id = await updateUser(user?._id, payload);
			}
			if (id) {
				await syncUsers();
				let user = getUser(id);
				setResult(user);
			}
			closeDialog();
		} else {
			showToast({ msg: 'Please fill the required fields' });
		}
	}
</script>

<form id="user-edit-form" onsubmit={handleSubmit}>
	<div class="px-6 grid grid-cols-1 md:grid-cols-3 gap-4">
		<div>
			<TextField
				name="name"
				label="User name"
				maxlength={80}
				bind:value={name}
				required
				autofocus
			/>
		</div>
		<div>
			<TextField name="desc" label="Description" maxlength={250} bind:value={desc} />
		</div>
		<div>
			<EmailField name="email" label="Email" bind:value={email} required />
		</div>
		<div>
			<PhoneField name="phone" label="Phone" bind:value={phone} dialCode="+91" />
		</div>
		<div>
			<ComboboxField name="subtype" label="User Type" items={USER_SUBTYPES} bind:value={subtype} />
		</div>
		<div>
			<UserComboboxField
				name="manager"
				label="Manager"
				bind:value={manager}
				userType={UserTypeEnum.USER_TYPE_USER}
			/>
		</div>
		<div>
			<TeamComboboxField name="team" label="Team" bind:value={team} />
		</div>
		<div>
			<AttributeComboboxField
				attributeType={AttributeTypeEnum.USER_DESIGNATION}
				name="desig"
				label="Designation"
				bind:value={desig}
				createButtonLabel="Add Designation"
			/>
		</div>
		<div>
			<AttributeComboboxField
				attributeType={AttributeTypeEnum.USER_DEPARTMENT}
				name="dept"
				label="Department"
				bind:value={dept}
				createButtonLabel="Add Department"
			/>
		</div>
		<div>
			<DateField name="dob" label="Date Of Birth" bind:value={dob} />
		</div>
		<div>
			<DateField name="doj" label="Date Of Joining" bind:value={doj} />
		</div>
		<div>
			<TextareaField name="address" label="Address" bind:value={address} />
		</div>
		<div>
			<CheckboxField name="canOrder" label="Can Place Order" bind:value={canOrder} />
		</div>
		<div>
			<CheckboxField name="isActive" label="Active" bind:value={isActive} />
		</div>
	</div>
</form>
