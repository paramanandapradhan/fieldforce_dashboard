<script lang="ts">
	import AuthUserReady from '$lib/auth/components/auth-user-ready.svelte';
	import {
		Button,
		ButtonMenu,
		IconCircle,
		Loading,
		mdiMagnify,
		navigate,
		NoData,
		openDeleteConfirmDialog,
		Pagination,
		SearchField,
		sort
	} from '@cloudparker/moldex.js';
	import { getAllUsers, UserTypeEnum } from '../user-service';
	import type { UserDataModel } from '../user-types';
	import {
		mdiAccount,
		mdiDotsHorizontal,
		mdiNotebookOutline
	} from '$lib/core/services/app-icons-service';
	import { openUserDeleteDialog, openUserEditDialog } from '../user-ui-service';
	import { appState } from '$lib/core/services/app-state.svelte';
	import TextUserSubtype from './text-user-subtype.svelte';
	import TextUserType from './text-user-type.svelte';

	let users: UserDataModel[] = $state([]);
	// let paginatedUsers: UserDataModel[] = $state([]);
	// let filteredUsers: UserDataModel[] = $state([]);
	let pageIndex: number = $state(0);
	let pageSize: number = $state(10);
	let searchText: string = $state('');
	let isLoading: boolean = $state(true);

	let filteredUsers = $derived(
		users.filter((user) => {
			const matchSearch = searchText
				? user.name?.toLowerCase().includes(searchText.toLowerCase())
				: true;
			return matchSearch;
		})
	);

	let paginatedUsers = $derived(
		filteredUsers.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)
	);

	export async function loadUsers() {
		isLoading = true;
		let array =
			((await getAllUsers({ type: UserTypeEnum.USER_TYPE_USER })) as UserDataModel[]) || [];
		users = sort({ array, field: 'name' });
		isLoading = false;
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
	<div class="p-4 max-w-72">
		<SearchField bind:value={searchText} placeholder="Search Users..." />
	</div>

	{#if isLoading}
		<Loading />
	{:else if searchText && filteredUsers.length <= 0}
		<NoData>
			<IconCircle
				iconPath={mdiMagnify}
				circleClassName="!bg-base-100 !w-12 !h-12"
				iconClassName="!w-6 !h-6 text-base-400"
			/>
			<div class="text-center text-base-400 text-sm mt-4">
				No search results found for "{searchText}"!.
			</div>
		</NoData>
	{:else if filteredUsers.length <= 0}
		<NoData>
			<IconCircle
				iconPath={mdiNotebookOutline}
				circleClassName="!bg-base-100 !w-12 !h-12"
				iconClassName="!w-6 !h-6 text-base-400"
			/>
			<div class="text-center text-base-400 text-sm mt-4">
				No Products ! <br />Please add Products!
			</div>
		</NoData>
	{:else}
		<table class="min-w-full divide-y divide-base-200 dark:divide-base-500 dark:text-base-200 table-fixed">
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
			<tbody class="divide-y divide-base-200 dark:divide-base-500">
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
						<td class="text-left px-4"><TextUserSubtype input={user?.subtype} /> </td>
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
				length={filteredUsers?.length}
				{pageIndex}
				{pageSize}
				onPageSizeChange={handlePageSizeChange}
				onPageIndexChange={handlePageIndexChange}
			/>
		</div>
	{/if}
</div>
