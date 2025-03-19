<script lang="ts">
	import {
		Button,
		CheckboxField,
		ColorField,
		ContentArea,
		Drawer,
		goBack,
		isMobileScreen,
		Sidebar
	} from '@cloudparker/moldex.js';
	import AppNavbar from '$lib/core/components/app-navbar.svelte';
	import BackgroundGradient from '$lib/core/components/background-gradient.svelte';
	import RestrictedDrawer from '$lib/drawer/components/restricted-drawer.svelte';
	import { page } from '$app/state';
	import type { UserDataModel } from '$lib/user/user-types';
	import { getUser } from '$lib/user/user-service';
	import { openUserEditDialog } from '$lib/user/user-ui-service';
	import { onMount } from 'svelte';
	import UserDetails from '$lib/user/components/user-details.svelte';

	let drawerRef: Drawer;

	let userId: string = $derived(page.url.searchParams.get('userId') || '');
	let user: UserDataModel | null = $state(null);

	function handleMore() {
		drawerRef && drawerRef.openDrawer();
	}

	async function loadUser() {
		if (userId) {
			user = await getUser(userId);
		} else {
			user = null;
		}
	}

	async function handleEdit() {
		if (user) {
			let res = await openUserEditDialog(user);
			if (res) {
				loadUser();
			}
		}
	}

	onMount(() => {
		loadUser();
	});
</script>

<div class="min-h-full">
	<AppNavbar title="VIEW USER" hasLogo hasTitle hasBack={isMobileScreen()} onBack={goBack} />
	<Drawer bind:this={drawerRef} className="border-r"><RestrictedDrawer /></Drawer>
	<Sidebar className="border-r "><RestrictedDrawer /></Sidebar>
	<ContentArea className="md:pl-72">
		<BackgroundGradient>
			<main>
				<div class="p-4 flex items-center justify-end">
					<Button appearance="border-primary" onClick={handleEdit} label="Edit" />
				</div>
				<div class="pb-32">
					{#if user != null}
						<div class="bg-white dark:bg-base-800 p-4 shadow rounded-lg m-4">
							<UserDetails {userId} />
						</div>
					{/if}
				</div>
			</main>
		</BackgroundGradient>
	</ContentArea>
</div>
