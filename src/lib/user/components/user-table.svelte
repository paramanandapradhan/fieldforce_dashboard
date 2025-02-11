<script lang="ts">
	import AuthUserReady from '$lib/auth/components/auth-user-ready.svelte';
	import {
		Button,
		ButtonMenu,
		IconCircle,
		navigate,
		openDeleteConfirmDialog,

		Pagination,

		sort


	} from '@cloudparker/moldex.js';
	import { getAllUsers, UserTypeEnum } from '../user-service';
	import type { UserDataModel } from '../user-types';
	import { mdiAccount, mdiDotsHorizontal } from '$lib/core/services/app-icons-service';
	import { openUserDeleteDialog, openUserEditDialog } from '../user-ui-service';
	import { appState } from '$lib/core/services/app-state.svelte';
	import TextUserSubtype from './text-user-subtype.svelte';
	import TextUserType from './text-user-type.svelte';

	let users: UserDataModel[] = $state([]);

	let paginatedUsers: UserDataModel[] = $state([]);
	let pageIndex: number = $state(0);
	let pageSize: number = $state(10);

	export async function loadUsers() {
		let array = ((await getAllUsers({ type: UserTypeEnum.USER_TYPE_USER })) as UserDataModel[]) || [];
		users = sort({array, field:'name'})
	}

	function handleReady() {
		loadUsers();
	}

	async function handleMenu(ev: MouseEvent, menu: string, user: UserDataModel) {
		switch (menu) {
			case 'Edit':
				await openUserEditDialog(user);
				await loadUsers();
				break;
			case 'Delete':
				await openUserDeleteDialog(user);
				await loadUsers();
				break;
			case 'View':
				handelViewUser(user);
				break;
		}
	}
	function handelViewUser(user: UserDataModel) {
		navigate(`/restricted/users/view?userId=${user._id}`);
	}

	$effect(() => {
		const start = pageIndex * pageSize;
		const end = start + pageSize;
		paginatedUsers = users.slice(start, end);
	});

	// Handle page index changes
	function handlePageIndexChange(newPageIndex: number) {
		pageIndex = newPageIndex;
	}

	// Handle page size changes
	function handlePageSizeChange(newPageSize: number) {
		pageSize = newPageSize;
		pageIndex = 0;
	}
</script>

<AuthUserReady onReady={handleReady} />
<div>
	<table class="min-w-full divide-y divide-base-200 table-fixed">
		<thead>
			<tr>
				<th class="text-left w-14"></th>
				<th class="text-left p-4">Name</th>
				<th class="text-left p-4">Email</th>
				<th class="text-left p-4">Phone</th>
				<th class="text-left p-4">Type</th>
				<th class="text-right p-4"></th>
			</tr>
		</thead>
		<tbody class="divide-y divide-base-200">
			{#each paginatedUsers as user, index}
				<tr>
					<td class="text-left pl-4 py-1 w-14">
						<IconCircle
							iconPath={mdiAccount}
							iconClassName="!h-5 !w-5 text-primary"
							circleClassName="!h-10 !w-10"
						/>
					</td>
					<td class="text-left px-4">
						<div>
							<a href="/restricted/users/view?userId={user._id}" class="hover:text-primary">
								{user.name || '-'}
							</a>
						</div>
						<div class="text-sm text-base-500">{user.desc || '-'}</div>
					</td>
					<td class="text-left px-4">{user.email || '-'}</td>
					<td class="text-left px-4">{user.phone || '-'}</td>
					<td class="text-left px-4"><TextUserType input={user.type!} /> </td>
					<td class="text-left px-4">
						<div class="flex justify-end">
							<ButtonMenu
								menus={['View', 'Edit', 'Delete']}
								iconPath={mdiDotsHorizontal}
								onMenu={(ev, menu) => handleMenu(ev, menu as string, user)}
								iconClassName="text-base-400 hover:text-base-800 {appState.theme == 'light'
									? ''
									: 'dark:hover:text-base-200'}"
							/>
						</div>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
	<div class="p-4">
		<Pagination
			length={users?.length}
			{pageIndex}
			{pageSize}
			onPageSizeChange={handlePageSizeChange}
			onPageIndexChange={handlePageIndexChange}
		/>
	</div>
</div>
