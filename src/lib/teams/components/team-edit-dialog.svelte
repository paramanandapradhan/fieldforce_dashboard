<script lang="ts">
	import UserComboboxField from '$lib/user/components/user-combobox-field.svelte';
	import { UserTypeEnum } from '$lib/user/user-service';
	import { showToast, TextField, type DialogExports } from '@cloudparker/moldex.js';
	import { createTeam, getTeam, syncTeams, updateTeam } from '../team-service';
	import type { TeamDataModel } from '../team-type';

	type Props = {
		team?: TeamDataModel;
	};

	let { team, closeDialog, setResult, setOkEnabled, setOkSpinner }: Props & DialogExports =
		$props();

	let name = $state(team?.name || '');
	let desc = $state(team?.desc || '');
	let manager = $state(team?.manager || '');

	async function handleSubmit(ev: SubmitEvent) {
		ev.preventDefault();
		name = (name || '').trim();
		desc = (desc || '').trim();
		manager = manager;

		if (name) {
			setOkEnabled(false);
			setOkSpinner(true);
			let payload = {
				name,
				desc,
				manager
			};
			let id = null;
			if (!team?._id) {
				id = await createTeam(payload);
			} else {
				id = await updateTeam(team?._id, payload);
			}
			if (id) {
				await syncTeams();
				let team = getTeam(id);
				setResult(team);
			}
			closeDialog();
		} else {
			showToast({ msg: 'Please fill the required fields' });
		}
	}
</script>

<form id="team-edit-form" onsubmit={handleSubmit}>
	<div class="px-6">
		<div class="my-4">
			<TextField
				name="Team name"
				label="Team name"
				maxlength={150}
				bind:value={name}
				required
				autofocus
			/>
		</div>
		<div class="my-4">
			<TextField name="desc" label="Description" maxlength={250} bind:value={desc} />
		</div>
		<div class="my-4">
			<UserComboboxField
				name="manager"
				label="Manager"
				bind:value={manager}
				userType={UserTypeEnum.USER_TYPE_USER}
			/>
		</div>
	</div>
</form>
