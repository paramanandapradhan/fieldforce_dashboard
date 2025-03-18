<script lang="ts">
	import {
		CheckboxField,
		ColorField,
		ContentArea,
		Drawer,
		Sidebar,
		Spinner
	} from '@cloudparker/moldex.js';
	import AppNavbar from '$lib/core/components/app-navbar.svelte';
	import BackgroundGradient from '$lib/core/components/background-gradient.svelte';
	// import UserStaffDetails from '$lib/user/components/user-staff-details.svelte';
	// import { AppAuthService } from '$lib/auth/services/app-auth-service.svelte';
	// import { UserDatabaseService } from '$lib/user/user-database-service';
	import AuthUserReady from '$lib/auth/components/auth-user-ready.svelte';
	import UserDetails from '$lib/user/components/user-details.svelte';
	import RestrictedDrawer from '$lib/drawer/components/restricted-drawer.svelte';
	import type { UserDataModel } from '$lib/user/user-types';
	import { getUser } from '$lib/user/user-service';
	import { getAuthOrgUserId, getFirebaseAuthUid } from '$lib/auth/services/auth-service.svelte';
	import BaseDataModelDetails from '$lib/core/components/base-data-model-details.svelte';
	import UserLoginDetails from '$lib/user/components/user-login-details.svelte';

	let drawerRef: Drawer | null = $state(null);
	// let userStaffDetails:UserStaffDetails|null =$state(null)
	// let authService = AppAuthService.getInstance();
	// let userService = UserDatabaseService.getInstance();

	let user: UserDataModel | null = $state(null);
	let userId: string | undefined = $state(undefined);

	// function invalidateUser() {
	// 	if (user && user._id == authService.getAuthOrgUserId()) {
	// 		authService.invalidateAuthUser();
	// 	}
	// }

	async function loadUser() {
		if (userId) {
			user = await getUser(userId);
		}
	}

	async function handleReady() {
		userId = getAuthOrgUserId();
		loadUser();
		console.log('handleReady............');
		console.log('userId--:', userId);
	}
</script>

<svelte:head>
	<title>Profile : User profile page</title>
</svelte:head>

<AuthUserReady onReady={handleReady} />
<div class="min-h-full">
	<AppNavbar hasLogo hasTitle />
	<Drawer bind:this={drawerRef} className="border-r">drawwer</Drawer>
	<Sidebar className="border-r "><RestrictedDrawer /></Sidebar>
	<ContentArea className="md:pl-72">
		<BackgroundGradient>
			<main class="">
				<div class="flex justify-center">
					<div class="w-full max-w-[800px]">
						<div class="p-4">
							<h1 class="text-2xl font-bold dark:text-base-200">Profile</h1>
						</div>
						<div class="my-8 lg:mx-6 mx-2 bg-white dark:bg-base-800 rounded-2xl p-4 shadow">
							<UserDetails {userId} showRootUserInfo></UserDetails>
							<!-- {#if user}
								<UserDetails
									input={user?._id}
									showRootUserInfo
									showEditName
									bind:this={userStaffDetails}
									on:photoUpdated={invalidateUser}
									on:nameUpdated={invalidateUser}
								/>
							{:else}
								<Spinner/>
							{/if} -->
						</div>
						<div class="my-8 lg:mx-6 mx-2 bg-white dark:bg-base-800 rounded-2xl p-4 shadow">
							<div class="mb-4">
								<h2 class="font-bold dark:text-base-300">Basic Information</h2>
							</div>
							<BaseDataModelDetails data={user!} />
						</div>
						<div class="my-8 lg:mx-6 mx-2 bg-white dark:bg-base-800 rounded-2xl p-4 shadow">
							<div>
								<h2 class="font-bold dark:text-base-300">Login Details</h2>
							</div>
							<UserLoginDetails />
						</div>
					</div>
				</div>
			</main>
		</BackgroundGradient>
	</ContentArea>
</div>
