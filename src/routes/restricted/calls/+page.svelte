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
	import { openCallEditDialog } from '$lib/call/call-ui-service';
	import CallList from '$lib/call/components/call-list.svelte';

	let drawerRef: Drawer;
	let callListRef: CallList;

	function handleMore() {
		drawerRef && drawerRef.openDrawer();
	}

	async function handleAdd() {
		await openCallEditDialog();
		callListRef && callListRef.loadCalls();
	}
</script>

<div class="min-h-full">
	<AppNavbar hasLogo hasTitle hasMore={isMobileScreen()} onMore={handleMore} />
	<Drawer bind:this={drawerRef} className="border-r"><RestrictedDrawer /></Drawer>
	<Sidebar className="border-r "><RestrictedDrawer /></Sidebar>
	<ContentArea className="md:pl-72">
		<BackgroundGradient>
			<main>
				<div class="p-8 flex items-center justify-between">
					<div><h1 class="text-xl font-black text-base-800 dark:text-base-300">Calls</h1></div>
					<div>
						<Button appearance="border-primary" onClick={handleAdd} label="ADD" />
					</div>
				</div>
				<div class="m-8 pb-16">
					<CallList bind:this={callListRef} />
				</div>
			</main>
		</BackgroundGradient>
	</ContentArea>
</div>
