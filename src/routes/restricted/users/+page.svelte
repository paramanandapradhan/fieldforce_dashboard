<script lang="ts">
	import AppNavbar from '$lib/core/components/app-navbar.svelte';
	import BackgroundGradient from '$lib/core/components/background-gradient.svelte';
	import { mdiSync } from '$lib/core/services/app-icons-service';
	import RestrictedDrawer from '$lib/drawer/components/restricted-drawer.svelte';
	import UserList from '$lib/user/components/user-list.svelte';
	import UserTable from '$lib/user/components/user-table.svelte';
	import { syncUsers } from '$lib/user/user-service';
	import { openUserEditDialog } from '$lib/user/user-ui-service';
	import {
		Button,
		ContentArea,
		Drawer,
		isMobileScreen,
		screenSize,
		Sidebar
	} from '@cloudparker/moldex.js';

	let drawerRef: Drawer;

	let userListRef: UserList;
	let userTableRef: UserTable;
	let isSyncInProgress = $state(false);

	function handleMore() {
		drawerRef && drawerRef.openDrawer();
	}

	async function handleAddUser() {
		let res = await openUserEditDialog();
		console.log(res);
		if (res) {
			handleLoadUser();
		}
	}

	async function handleLoadUser() {
		userListRef && userListRef.loadUsers();
		userTableRef && userTableRef.loadUsers();
	}

	async function handleSync() {
		isSyncInProgress = true;
		await syncUsers();
		await handleLoadUser();
		isSyncInProgress = false;
	}
</script>

<div class="min-h-full">
	<AppNavbar hasLogo hasTitle hasMore={isMobileScreen()} onMore={handleMore} />
	<Drawer bind:this={drawerRef} className="border-r"><RestrictedDrawer /></Drawer>
	<Sidebar className="border-r ">
		<RestrictedDrawer />
	</Sidebar>
	<ContentArea className="md:pl-72">
		<BackgroundGradient>
			<main>
				<div class="pb-32">
					<div class="p-4 flex flex-wrap items-center gap-4">
						<div class="flex-grow"><h5 class="text-xl font-bold dark:text-base-200">Users</h5></div>
						<div>
							<Button
								appearance="base"
								onClick={handleSync}
								title="Sync"
								iconPath={mdiSync}
								iconClassName={isSyncInProgress ? 'animate-spin' : ''}
							/>
						</div>
						<div class="w-full sm:w-auto">
							<Button
								appearance="border-primary"
								onClick={handleAddUser}
								label="Add User"
								className="w-full sm:w-auto"
							/>
						</div>
					</div>
					<div class="m-4 p-4 bg-white dark:bg-base-800 shadow rounded-lg">
						{#if screenSize.isSm || screenSize.isMd || screenSize.isXs}
							<UserList bind:this={userListRef} />
						{:else}
							<UserTable bind:this={userTableRef} />
						{/if}
					</div>
				</div>
			</main>
		</BackgroundGradient>
	</ContentArea>
</div>
