<script lang="ts">
	import AuthUserReady from '$lib/auth/components/auth-user-ready.svelte';
	import { Button, ButtonMenu, openDeleteConfirmDialog } from '@cloudparker/moldex.js';
	import { getAllUsers } from '../user-service';
	import type { UserDataModel } from '../user-types';
	import { mdiDotsHorizontal } from '$lib/core/services/app-icons-service';
	import { openUserDeleteDialog, openUserEditDialog } from '../user-ui-service';

	let users: UserDataModel[] = $state([]);

	export async function loadUsers() {
		users = (await getAllUsers()) || [];
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
		}
	}
</script>

<AuthUserReady onReady={handleReady} />
<div>
	{#each users as user, index}
		<div>
			<Button className="w-full text-start !px-4">
				<div></div>
				<div class="flex-grow">
					<div>{user.name || ''}</div>
					<div class="text-sm text-base-400">{user.desc || ''}</div>
				</div>
				<div>
					<ButtonMenu
						menus={['Edit', 'Delete']}
						iconPath={mdiDotsHorizontal}
						onMenu={(ev, menu) => handleMenu(ev, menu as string, user)}
					/>
				</div>
			</Button>
		</div>
	{/each}
</div>
