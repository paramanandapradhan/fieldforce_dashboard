<script lang="ts">
	import {
		EmailField,
		PhoneField,
		showToast,
		TextField,
		type DialogExports
	} from '@cloudparker/moldex.js';
	import { UserTypeEnum, type UserDataModel } from '../user-types';
	import { createUser, getUser, syncUsers, updateUser } from '../user-service';

	type Props = {
		user?: UserDataModel;
	};

	let { user, closeDialog, setResult, setOkEnabled, setOkSpinner }: Props & DialogExports =
		$props();

	let name = $state(user?.name || '');
	let desc = $state(user?.desc || '');
	let email = $state(user?.email || '');
	let phone = $state(user?.phone || '');

	async function handleSubmit(ev: SubmitEvent) {
		ev.preventDefault();
		name = (name || '').trim();
		desc = (desc || '').trim();
		email = (email || '').trim();
		phone = (phone || '').trim();
		if (name && email) {
			setOkEnabled(false);
			setOkSpinner(true);
			let payload = { name, desc, email, phone, type: UserTypeEnum.USER_TYPE_STAFF };
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
	<div class="px-6">
		<div class="my-4">
			<TextField
				name="name"
				label="User name"
				maxlength={80}
				bind:value={name}
				required
				autofocus
			/>
		</div>
		<div class="my-4">
			<TextField name="desc" label="Description" maxlength={250} bind:value={desc} />
		</div>
		<div class="my-4">
			<EmailField name="email" label="Email" bind:value={email} required />
		</div>
		<div class="my-4">
			<PhoneField name="phone" label="Phone" bind:value={phone} dialCode="+91" />
		</div>
	</div>
</form>
