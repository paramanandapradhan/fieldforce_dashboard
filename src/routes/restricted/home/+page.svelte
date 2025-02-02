<script lang="ts">
	import { goto } from '$app/navigation';
	import AuthEmailVerifiationAlert from '$lib/auth/components/auth-email-verifiation-alert.svelte';
	import AuthOrganizationRequiredAlert from '$lib/auth/components/auth-organization-required-alert.svelte';
	import AuthUserNameRequiredAlert from '$lib/auth/components/auth-user-name-required-alert.svelte';
	import AuthUserReady from '$lib/auth/components/auth-user-ready.svelte';
	import { authState } from '$lib/auth/services/auth-state.svelte';

	import AppNavbar from '$lib/core/components/app-navbar.svelte';
	import BackgroundGradient from '$lib/core/components/background-gradient.svelte';
	import RestrictedDrawer from '$lib/drawer/components/restricted-drawer.svelte';
	import { Button, ContentArea, Drawer, isMobileScreen, Sidebar } from '@cloudparker/moldex.js';

	let drawerRef: Drawer;

	let isEmailVerified: boolean = $state(true);

	function handleMore() {
		drawerRef && drawerRef.openDrawer();
	}

	function handleReady() {}
</script>

<AuthUserReady onReady={handleReady}></AuthUserReady>
<div class="min-h-full">
	<AppNavbar hasLogo hasTitle hasMore={isMobileScreen()} onMore={handleMore} />
	<Drawer bind:this={drawerRef} className="border-r"><RestrictedDrawer /></Drawer>
	<Sidebar>
		<RestrictedDrawer />
	</Sidebar>
	<ContentArea className="md:pl-72">
		<BackgroundGradient>
			<main>
				<div class="text-center my-4 font-bold text-xl">
					<h1>Home Dashboard</h1>
				</div>
				{#if authState.isEmailVerificationRequired}
					<div class="container max-w-[800px] my-4">
						<AuthEmailVerifiationAlert />
					</div>
				{/if}
				{#if authState.isUserNameRequired}
					<div class="container max-w-[800px] my-4">
						<AuthUserNameRequiredAlert />
					</div>
				{/if}
				{#if authState.isNewOrganizationRequired}
					<div class="container max-w-[800px] my-4">
						<AuthOrganizationRequiredAlert />
					</div>
				{/if}
			</main>
		</BackgroundGradient>
	</ContentArea>
</div>
