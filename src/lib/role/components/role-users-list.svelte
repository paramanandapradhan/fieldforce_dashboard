<script lang="ts">
	import AuthUserReady from '$lib/auth/components/auth-user-ready.svelte';
	import { ADMIN_USER_ID } from '$lib/core/services/app-service';
	import { getAllUsers, syncUsers, updateUser } from '$lib/user/user-service';
	import { UserTypeEnum, type UserDataModel } from '$lib/user/user-types';
	import {
		Button,
		ButtonListItem,
		ButtonMenu,
		openDeleteConfirmDialog,
		openLoadingDialog,
		showErrorToast,
		showToast,
		sort
	} from '@cloudparker/moldex.js';
	import { ADMIN_ROLE_ID } from '../role-service';
	import type { RoleDataModel } from '../role-types';
	import { openRolePickerDialog } from '../role-ui-service';

	type Props = {
		role?: RoleDataModel;
	};

	let { role }: Props = $props();

	let users: UserDataModel[] = $state([]);

	export async function loadUsers() {
		console.log('loadUsers', role);
		if (role && role._id) {
			let localUsers = await getAllUsers({ type: UserTypeEnum.USER_TYPE_STAFF });

			if (localUsers) {
				localUsers = localUsers.filter((user: UserDataModel) => {
					return user.rid === role._id;
				});
				users = sort({ array: localUsers, field: 'name' });
				console.log('localUsers', localUsers, users);
			}
		}
	}

	async function handleReady(..._: any) {
		await loadUsers();
	}

	async function handleMenu(ev: Event, menu: string, user: UserDataModel) {
		switch (menu) {
			case 'Change Role':
				await changeRole(user);
				break;
			case 'Remove Role':
				await removeRole(user);
				break;
			default:
				break;
		}
	}

	async function changeRole(user: UserDataModel) {
		if (user?._id && user._id === ADMIN_USER_ID && user.rid === ADMIN_ROLE_ID) {
			return showToast({ msg: 'Can not chnage Admin permission of this user!' });
		}
		if (user && user._id) {
			let roleId = (await openRolePickerDialog({ value: user.rid })) as string;
			if (roleId) {
				let loader = await openLoadingDialog();
				try {
					await updateUser(user._id, { rid: roleId });
					await syncUsers();
					await loadUsers();
				} catch (error) {
					console.error(error);
					showErrorToast();
				}
				await loader.closeDialog();
			}
		}
	}

	async function removeRole(user: UserDataModel) {
		if (user?._id && user._id === ADMIN_USER_ID && user.rid === ADMIN_ROLE_ID) {
			return showToast({ msg: 'Can not remove Admin permission of this user!' });
		}
		if (
			user &&
			user._id &&
			(await openDeleteConfirmDialog({
				msg: `Are you sure to remove user from <b>${role?.name}</b> role?`,
				footerOkButtonLable: 'Yes, Remove'
			}))
		) {
			let loader = await openLoadingDialog();

			try {
				await updateUser(user._id, { rid: '' });
				await syncUsers();
				await loadUsers();
			} catch (error) {
				console.error(error);
				showErrorToast();
			}

			await loader.closeDialog();
		}
	}
</script>

<AuthUserReady onReady={handleReady} />
<div>
	{#each users as user, index}
		<Button className="w-full text-start justify-start rounded-none">
			<div>
				<!-- <UserAvatarLogo {user} /> -->
			</div>
			<div class="flex-grow">
				<div class="">{user.name || ''}</div>
				<div class="text-sm text-base-400">{user.desc || ''}</div>
			</div>
			<div>
				<ButtonMenu
					menus={['Change Role', 'Remove Role']}
					onMenu={(ev, menu) => handleMenu(ev, menu as string, user)}
				/>
			</div>
		</Button>
		<!-- <ListDivider {index} length={users?.length} marginLeft="64px" /> -->
	{/each}
</div>
