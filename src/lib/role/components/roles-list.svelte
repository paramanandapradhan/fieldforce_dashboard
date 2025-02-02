<script lang="ts">
	import AuthUserReady from '$lib/auth/components/auth-user-ready.svelte';
	import { fade } from 'svelte/transition';
	import { ADMIN_ROLE_ID, deleteRole, getAllRoles, syncRoles } from '../role-service';
	import {
		Button,
		ButtonMenu,
		Icon,
		mdiChevronDown,
		openDeleteConfirmDialog,
		openDialog,
		openLoadingDialog,
		ripple,
		showErrorToast,
		showToast,
		sort
	} from '@cloudparker/moldex.js';
	import { FeatureScopeEnum, type RoleDataModel } from '../role-types';
	import { FEATURES_LIST } from '../feature-service';
	import { openRoleEditDialog, openRolePermissionEditDialog, openRoleUsersListDialog } from '../role-ui-service';
	import RoleScopeList from './role-scope-list.svelte';
	import RolePermissionEditDialog from './role-permission-edit-dialog.svelte';

	let roles: RoleDataModel[] = $state([]);
	let expanded: { items: { [key: string]: string } } = $state({ items: {} });
	let searchText: string = $state('');

	let filteredRoles: RoleDataModel[] = $derived.by(() => {
		if (searchText) {
			return (roles || []).filter(
				(role) => (role.name || '').toLowerCase().indexOf(searchText) >= 0
			);
		} else {
			return (roles || []).slice();
		}
	});

	export function search(search: string) {
		searchText = search;
	}

	export async function loadRoles() {
		roles = (await getAllRoles()) || [];
		roles = sort({ array: roles, field: 'name' });
	}

	async function handleReady() {
		await loadRoles();
	}

	function getScopeCount(role: RoleDataModel) {
		// If Admin role id return full permission, means return all feature count.
		// Where Admin
		if (role && role._id == ADMIN_ROLE_ID) {
			return FEATURES_LIST.length;
		} else {
			return Object.keys(role.scp || {}).filter((scope) => {
				if (role.scp) {
					return role.scp[scope] !== FeatureScopeEnum.NONE;
				}
			}).length;
		}
	}

	async function handleMenu(ev: Event, menu: string, role: RoleDataModel) {
		switch (menu) {
			case 'Edit':
				handleEditRole(role);
				break;
			case 'Delete':
				handleDeleteRole(role);
				break;
			default:
				break;
		}
	}

	async function handleEditRole(role: RoleDataModel) {
		if (role?._id) {
			if (role._id == ADMIN_ROLE_ID) {
				return showToast({ msg: 'Can not edit the Admin Role!' });
			}
			let res = await openRoleEditDialog(role);
			if (res) {
				await loadRoles();
			}
		}
	}

	async function handleDeleteRole(role: RoleDataModel) {
		if (role?._id) {
			if (role._id == ADMIN_ROLE_ID) {
				return showToast({ msg: 'Can not delete the Admin Role!' });
			}

			if (await openDeleteConfirmDialog()) {
				let loader = await openLoadingDialog();
				try {
					let id = await deleteRole(role._id);
					if (id) {
						await syncRoles();
						await loadRoles();
					}
				} catch (error) {
					console.error(error);
					showErrorToast();
				}
				await loader.closeDialog();
			}
		}
	}

	function handleExpand(role: RoleDataModel) {
		if (role._id) {
			if (expanded.items[role._id]) {
				delete expanded.items[role._id];
			} else {
				expanded.items[role._id] = role._id;
			}
		}
	}

	async function handleAlterPermission(role: RoleDataModel) {
		if (role) {
			let res = await openRolePermissionEditDialog(role);
			if (res) {
				await loadRoles();
			}
		}
	}

	async function handleShowRoleUsers(role: RoleDataModel) {
		console.log('handleShowRoleUsers');
		if (role) {
			let res = await openRoleUsersListDialog(role)
			if (res) {
				await loadRoles();
			}
		}
	}
</script>

<AuthUserReady onReady={handleReady} />
<div>
	{#each filteredRoles as role (role._id)}
		{@const scopeCount = getScopeCount(role)}
		{@const isExpanded = !!expanded.items[role._id!]}
		<div class="my-2 bg-white shadow-sm rounded">
			<div class="flex align-center py-2 gap-3">
				<div class="">
					<Button onClick={() => handleExpand(role)} className="!px-4">
						<Icon path={mdiChevronDown} className=" {isExpanded ? 'rotate-180' : ''}"></Icon>
					</Button>
				</div>
				<div class="flex-grow flex align-center">
					<div class="flex-grow">
						<div class="font-bold">{role?.name || ''}</div>
						<div class="text-sm text-base-400">{role?.desc || ''}</div>
					</div>
					<div></div>
				</div>
				<div
					title="{scopeCount || ' 0 '} Features Allowed for this Role"
					class="flex items-center justify-center rounded-full aspect-square w-6 h-6 bg-base-400 text-base-50 text-center text-xs"
				>
					<span class="  ">
						{scopeCount || ' - '}
					</span>
				</div>

				<div class="mx-2">
					<ButtonMenu
						title={role?._id === ADMIN_ROLE_ID ? 'Can not alter Admin Role' : ''}
						disabled={role?._id === ADMIN_ROLE_ID}
						menus={['Edit', 'Delete']}
						onMenu={(ev, menu) => handleMenu(ev, menu as string, role)}
					/>
				</div>
			</div>
			{#if isExpanded}
				<div class="p-4" transition:fade>
					<div>
						<RoleScopeList
							{role}
							showAlterPermission
							showAlterUser
							onShowRoleUsers={() => handleShowRoleUsers(role)}
							onAlterPermission={() => handleAlterPermission(role)}
						/>
					</div>
				</div>
			{/if}
		</div>
	{/each}
</div>
