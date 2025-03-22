<script lang="ts">
	import {
		Button,
		CheckboxField,
		ColorField,
		ContentArea,
		Drawer,
		isMobileScreen,
		Sidebar
	} from '@cloudparker/moldex.js';
	import AppNavbar from '$lib/core/components/app-navbar.svelte';
	import BackgroundGradient from '$lib/core/components/background-gradient.svelte';
	import RestrictedDrawer from '$lib/drawer/components/restricted-drawer.svelte';
	import { openRoleEditDialog } from '$lib/role/role-ui-service';
	import RolesList from '$lib/role/components/roles-list.svelte';
	import { syncRoles } from '$lib/role/role-service';
	import { mdiSync } from '$lib/core/services/app-icons-service';

	let drawerRef: Drawer;

	let rolesListRef: RolesList;
	let isSyncInProgress = $state(false);

	function handleMore() {
		drawerRef && drawerRef.openDrawer();
	}

	async function handleAdd() {
		let res = await openRoleEditDialog();
		if (res) {
			loadRoles();
		}
	}

	async function loadRoles() {
		rolesListRef && rolesListRef.loadRoles();
	}
	async function handleSync() {
		isSyncInProgress = true;
		await syncRoles();
		await loadRoles();
		isSyncInProgress = false;
	}
</script>

<div class="min-h-full">
	<AppNavbar hasLogo hasTitle hasMore={isMobileScreen()} onMore={handleMore}/>
	<Drawer bind:this={drawerRef} className="border-r"><RestrictedDrawer /></Drawer>
	<Sidebar className="border-r "><RestrictedDrawer /></Sidebar>
	<ContentArea className="md:pl-72">
		<BackgroundGradient>
			<main>
				<div class="pb-32">
					<div class="flex flex-wrap items-center gap-4 p-4 md:p-8">
						<div class="flex-grow">
							<h1 class="text-lg md:text-xl font-black text-base-800 dark:text-base-300">Roles</h1>
						</div>
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
								onClick={handleAdd}
								label="Add Role"
								className="w-full sm:w-auto"
							/>
						</div>
					</div>
					<div class="mx-4 md:mx-8">
						<RolesList bind:this={rolesListRef} />
					</div>
				</div>
			</main>
		</BackgroundGradient>
	</ContentArea>
</div>
