<script lang="ts">
	import AuthUserReady from '$lib/auth/components/auth-user-ready.svelte';
	import {
		Button,
		ButtonListItem,
		ButtonMenu,
		IconCircle,
		Loading,
		mdiMagnify,
		navigate,
		NoData,
		openDeleteConfirmDialog,
		SearchField,
		sort
	} from '@cloudparker/moldex.js';
	import { getAllUsers, UserTypeEnum } from '../user-service';
	import type { UserDataModel } from '../user-types';
	import {
		mdiAccount,
		mdiDotsHorizontal,
		mdiInformationOutline,
		mdiNotebookOutline
	} from '$lib/core/services/app-icons-service';
	import {
		openUserBasicDetailsDialog,
		openUserDeleteDialog,
		openUserEditDialog
	} from '../user-ui-service';
	import WindowInfiniteScroll from '$lib/core/components/window-infinite-scroll.svelte';
	import { appState } from '$lib/core/services/app-state.svelte';

	let users: UserDataModel[] = $state([]);
	// let paginatedUsers: UserDataModel[] = $state([]);
	let pageIndex: number = $state(0);
	let pageSize: number = $state(10);
	let isLoading: boolean = $state(true);
	let searchText: string = $state('');

	let filteredUsers = $derived(
		users.filter((user) =>
			searchText ? user.name?.toLowerCase().includes(searchText.toLowerCase()) : true
		)
	);

	let paginatedUsers = $derived(filteredUsers.slice(0, (pageIndex + 1) * pageSize));

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

	// Infinite scrolling logic
	function loadMore() {
		pageIndex++;
	}
</script>

<AuthUserReady onReady={handleReady} />
<WindowInfiniteScroll {loadMore} triggerDistance={500} side="bottom" />
<div class="p-4">
	<SearchField bind:value={searchText} placeholder="Search Users..." />
</div>
<div>
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
		{#each paginatedUsers as user, index}
			<ButtonListItem onClick={() => handelViewUser(user)} className="!pe-2">
				<div>
					<IconCircle
						iconPath={mdiAccount}
						iconClassName="!h-5 !w-5 text-primary"
						circleClassName="!h-10 !w-10"
					/>
				</div>
				<div class="flex-grow px-2">
					<div>
						{user.name || '-'}
					</div>
					<div class="text-base-500 text-sm">
						{user.desc || ''}
					</div>
				</div>

				<div class="flex justify-end">
					<ButtonMenu
					className="!px-2"
						menus={['View', 'Edit', 'Delete']}
						iconPath={mdiDotsHorizontal}
						onMenu={(ev, menu) => handleMenu(ev, menu as string, user)}
						iconClassName="text-base-400 hover:text-base-800 {appState.theme == 'light'
							? ''
							: 'dark:hover:text-base-200'}"
					/>
				</div>
			</ButtonListItem>
		{/each}
	{/if}
</div>
