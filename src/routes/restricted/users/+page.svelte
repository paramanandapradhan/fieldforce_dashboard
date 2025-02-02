<script lang="ts">
	import AppNavbar from '$lib/core/components/app-navbar.svelte';
	import BackgroundGradient from '$lib/core/components/background-gradient.svelte';
	import RestrictedDrawer from '$lib/drawer/components/restricted-drawer.svelte';
	import UserList from '$lib/user/components/user-list.svelte';
	import { openUserEditDialog } from '$lib/user/user-ui-service';
	import { Button, ContentArea, Drawer, Sidebar } from '@cloudparker/moldex.js';

	let drawerRef: Drawer;

	let userListRef: UserList;

	function handleMore() {
		drawerRef && drawerRef.openDrawer();
	}

	async function handleAddUser() {
		let res = await openUserEditDialog();
		console.log(res);
		if (res) {
			userListRef.loadUsers();
		}
	}
</script>

<div class="min-h-full">
	<AppNavbar hasLogo hasTitle />
	<Drawer bind:this={drawerRef} className="border-r">Users</Drawer>
	<Sidebar className="border-r ">
		<RestrictedDrawer />
	</Sidebar>
	<ContentArea className="md:pl-72">
		<BackgroundGradient>
			<main>
				<div class="flex items-center justify-between m-4">
					<div><h5 class="text-xl font-bold">Users</h5></div>
					<div>
						<Button appearance="border-primary" onClick={handleAddUser}>Add User</Button>
					</div>
				</div>
				<div class="my-4">
					<UserList bind:this={userListRef} />
				</div>
			</main>
		</BackgroundGradient>
	</ContentArea>
</div>
