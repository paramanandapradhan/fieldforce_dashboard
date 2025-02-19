<script lang="ts">
	import {
		Button,
		CheckboxField,
		ColorField,
		ContentArea,
		Drawer,
		goBack,
		isMobileScreen,
		openLoadingDialog,
		screenSize,
		Sidebar
	} from '@cloudparker/moldex.js';
	import AppNavbar from '$lib/core/components/app-navbar.svelte';
	import BackgroundGradient from '$lib/core/components/background-gradient.svelte';
	import RestrictedDrawer from '$lib/drawer/components/restricted-drawer.svelte';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import type { TeamDataModel } from '$lib/teams/team-type';
	import { getTeam } from '$lib/teams/team-service';
	import TeamDetails from '$lib/teams/components/team-details.svelte';
	import { openTeamEditDialog } from '$lib/teams/team-ui-service';
	import { getAllUsers, syncUsers, updateUser, UserTypeEnum } from '$lib/user/user-service';
	import type { UserDataModel } from '$lib/user/user-types';
	import { openUserPickerDialog } from '$lib/user/user-ui-service';
	import TeamUserList from '$lib/teams/components/team-user-list.svelte';
	import TeamUserTable from '$lib/teams/components/team-user-table.svelte';

	let drawerRef: Drawer;

	let teamId: string = $derived(page.url.searchParams.get('teamId') || '');
	let team: TeamDataModel | null = $state(null);
	let teamUsers: UserDataModel[] = $state([]);

	function handleMore() {
		drawerRef && drawerRef.openDrawer();
	}

	async function loadTeam() {
		if (teamId) {
			team = await getTeam(teamId);
		} else {
			team = null;
		}
	}

	async function handleEdit() {
		if (team) {
			let res = await openTeamEditDialog(team);
			if (res) {
				loadTeam();
			}
		}
	}

	async function loadTeamUsers() {
		if (teamId) {
			let array = (await getAllUsers({
				type: UserTypeEnum.USER_TYPE_USER,
				team: teamId
			})) as UserDataModel[];

			// console.log('array', array);
			teamUsers = array;
		} else {
			teamUsers = [];
		}
	}

	async function handleAddUser() {
		let custId: string = (await openUserPickerDialog({
			userType: UserTypeEnum.USER_TYPE_USER
		})) as string;
		if (custId && teamId) {
			let loader = await openLoadingDialog();
			await updateUser(custId, { team: teamId } as UserDataModel);
			await syncUsers();
			await loadTeamUsers();
			await loader.closeDialog();
		}
	}

	function handleChange() {
		loadTeam();
		loadTeamUsers();
	}

	onMount(() => {
		loadTeam();
		loadTeamUsers();
	});
</script>

<div class="min-h-full">
	<AppNavbar title="VIEW PRODUCT" hasLogo hasTitle hasBack={isMobileScreen()} onBack={goBack} />
	<Drawer bind:this={drawerRef} className="border-r"><RestrictedDrawer /></Drawer>
	<Sidebar className="border-r "><RestrictedDrawer /></Sidebar>
	<ContentArea className="md:pl-72">
		<BackgroundGradient>
			<main>
				<div class="pb-32">
					<div class="p-4 flex items-center justify-between">
						<div><h1 class="text-xl font-black">Teams Details</h1></div>
						<div>
							<Button appearance="border-primary" onClick={handleEdit} label="Edit" />
						</div>
					</div>
					<div class="pb-8">
						{#if team != null}
							<div class="bg-white p-4 shadow rounded-lg m-4">
								<TeamDetails {teamId} />
							</div>
						{/if}
					</div>
					<div class="bg-white rounded-lg shadow p-4 m-4">
						<div class="flex">
							<div class=" flex-grow">
								<h3 class="text-lg font-bold">Team Members</h3>
							</div>
							<div>
								<Button appearance="base" onClick={handleAddUser}>Add User</Button>
							</div>
						</div>
						<div class="my-4">
							{#if screenSize.isSm || screenSize.isMd || screenSize.isXs}
								<TeamUserList users={teamUsers} onChange={handleChange} />
							{:else}
								<TeamUserTable users={teamUsers} onChange={handleChange} />
							{/if}
						</div>
					</div>
				</div>
			</main>
		</BackgroundGradient>
	</ContentArea>
</div>
