<script lang="ts">
	import {
		Button,
		CheckboxField,
		ColorField,
		ContentArea,
		Drawer,
		Sidebar
	} from '@cloudparker/moldex.js';
	import AppNavbar from '$lib/core/components/app-navbar.svelte';
	import BackgroundGradient from '$lib/core/components/background-gradient.svelte';
	import RestrictedDrawer from '$lib/drawer/components/restricted-drawer.svelte';
	import { openRoleEditDialog } from '$lib/role/role-ui-service';
	import RolesList from '$lib/role/components/roles-list.svelte';

	let drawerRef: Drawer;

	let rolesListRef: RolesList;

	function handleMore() {
		drawerRef && drawerRef.openDrawer();
	}

	async function handleAdd() {
		let res = await openRoleEditDialog();
		if (res) {
			rolesListRef && rolesListRef.loadRoles();
		}
	}
</script>

<div class="min-h-full">
	<AppNavbar hasLogo hasTitle />
	<Drawer bind:this={drawerRef} className="border-r"><RestrictedDrawer /></Drawer>
	<Sidebar className="border-r "><RestrictedDrawer /></Sidebar>
	<ContentArea className="md:pl-72">
		<BackgroundGradient>
			<main>
				<div class="m-4 flex items-center justify-between">
					<div><h1 class="text-xl font-black">Roles</h1></div>
					<div>
						<Button appearance="border-primary" onClick={handleAdd} label="Add Role" />
					</div>
				</div>
				<div class="m-4">
					<RolesList bind:this={rolesListRef} />
				</div>
			</main>
		</BackgroundGradient>
	</ContentArea>
</div>
