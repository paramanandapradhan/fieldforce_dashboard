<script lang="ts">
	import { TextField, type DialogExports } from '@cloudparker/moldex.js';
	import type { RoleDataModel } from '../role-types';
	import { createRole, getRole, syncRoles, updateRole } from '../role-service';

	type Props = {
		role?: RoleDataModel;
	};

	let { role, closeDialog, setOkEnabled, setOkSpinner }: DialogExports & Props = $props();

	let name = $state(role?.name || '');
	let desc = $state(role?.desc || '');

	async function handleSubmit(ev: Event) {
		ev.preventDefault();
		name = (name || '').trim();
		desc = (desc || '').trim();
		let id;
		try {
			if (name) {
				setOkEnabled(false);
				setOkSpinner(true);
				if (role?._id) {
					id = await updateRole(role._id, { name, desc });
				} else {
					id = await createRole({ name, desc });
				}
			}
			if (id) {
				await syncRoles();
				let role = getRole(id);
				await closeDialog(role);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setOkEnabled(true);
			setOkSpinner(false);
		}
	}
</script>

<form id="role-edit-form" onsubmit={handleSubmit}>
	<div class="px-6">
		<div class="my-4">
			<TextField
				name="name"
				label="Role name"
				maxlength={30}
				required
				autofocus
				bind:value={name}
			/>
		</div>
		<div class="my-4">
			<TextField name="desc" label="Description" maxlength={100} bind:value={desc} />
		</div>
	</div>
</form>
