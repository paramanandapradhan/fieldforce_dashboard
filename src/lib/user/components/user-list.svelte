<script lang="ts">
	import AuthUserReady from '$lib/auth/components/auth-user-ready.svelte';
	import {
		Button,
		ButtonListItem,
		ButtonMenu,
		IconCircle,
		Loading,
		navigate,
		openDeleteConfirmDialog,
		sort
	} from '@cloudparker/moldex.js';
	import { getAllUsers, UserTypeEnum } from '../user-service';
	import type { UserDataModel } from '../user-types';
	import { mdiAccount, mdiDotsHorizontal } from '$lib/core/services/app-icons-service';
	import { openUserDeleteDialog, openUserEditDialog } from '../user-ui-service';
	import WindowInfiniteScroll from '$lib/core/components/window-infinite-scroll.svelte';
	import { appState } from '$lib/core/services/app-state.svelte';

	let users: UserDataModel[] = $state([]);

	let paginatedUsers: UserDataModel[] = $state([]);
	let pageIndex: number = $state(0);
	let pageSize: number = $state(10);
	let isLoading: boolean = $state(false);

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

	function loadMore() {
		const start = pageIndex * pageSize;
		const end = start + pageSize;
		const newItems = users.slice(start, end);
		if (newItems.length) {
			paginatedUsers = [...paginatedUsers, ...newItems];
			pageIndex++;
		}
	}
</script>

<AuthUserReady onReady={handleReady} />
<WindowInfiniteScroll {loadMore} triggerDistance={500} side="bottom" />
<div>
	{#if isLoading}
		<Loading />
	{:else}
		{#each users as user, index}
			<ButtonListItem onClick={() => handelViewUser(user)}>
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
