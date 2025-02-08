<script lang="ts">
	import {
		Button,
		Icon,
		openDialog,
		openLoadingDialog,
		showErrorToast,
		showToast,
		type DialogExports
	} from '@cloudparker/moldex.js';
	import type { RoleDataModel } from '../role-types';
	import RoleUsersList from './role-users-list.svelte';
	import { mdiPlus } from '$lib/core/services/app-icons-service';
	import type { Snippet } from 'svelte';
	import { openUserPickerDialog } from '$lib/user/user-ui-service';
	import { ADMIN_USER_ID } from '$lib/core/services/app-service';
	import { syncUsers, updateUser, UserTypeEnum } from '$lib/user/user-service';

	type Props = {
		role?: RoleDataModel;
	};

	let { role, closeDialog, setHeaderSnippet }: DialogExports & Props = $props();

	let roleUsersList: RoleUsersList;

	async function handleAddUser() {
		console.log('handleAddUser');
		let userId: string = (await openUserPickerDialog({
			userType: UserTypeEnum.USER_TYPE_USER
		})) as string;
		if (userId) {
			if (userId == ADMIN_USER_ID) {
				return showToast({ msg: 'This user permission can not be changed!' });
			}
			let loading = await openLoadingDialog();
			try {
				await updateUser(userId, { rid: role?._id });
				await syncUsers();
				roleUsersList && roleUsersList.loadUsers();
			} catch (error) {
				console.log(error);
				showErrorToast();
			}
			loading.closeDialog();
		}
	}

	setHeaderSnippet(addUser as Snippet);
</script>

{#snippet addUser()}
	<div>
		<Button title="Add more user to this role" onClick={handleAddUser}>
			<Icon path={mdiPlus} />
		</Button>
	</div>
{/snippet}

<div class="min-h-52">
	<RoleUsersList role={role!} bind:this={roleUsersList}></RoleUsersList>
</div>
