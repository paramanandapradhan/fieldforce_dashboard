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

	let drawerRef: Drawer;

	function handleMore() {
		drawerRef && drawerRef.openDrawer();
	}

	function handleAdd() {}
</script>

<div class="min-h-full">
	<AppNavbar hasLogo hasTitle hasMore={isMobileScreen()} onMore={handleMore} />
	<Drawer bind:this={drawerRef} className="border-r"><RestrictedDrawer /></Drawer>
	<Sidebar className="border-r "><RestrictedDrawer /></Sidebar>
	<ContentArea className="md:pl-72">
		<BackgroundGradient>
			<main>
				<div class="p-4 flex items-center justify-between">
					<div><h1 class="text-xl font-black">Attendance</h1></div>
					<div>
						<!-- <Button appearance="border-primary" onClick={handleAdd} label="Add Team" /> -->
					</div>
				</div>
			</main>
		</BackgroundGradient>
	</ContentArea>
</div>
