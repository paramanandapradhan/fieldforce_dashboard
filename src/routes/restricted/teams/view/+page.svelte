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
	import { onMount } from 'svelte';
	import type { TeamDataModel } from '$lib/teams/team-type';
	import { getTeam } from '$lib/teams/team-service';
	import TeamDetails from '$lib/teams/components/team-details.svelte';
	import { openTeamEditDialog } from '$lib/teams/team-ui-service';

	let drawerRef: Drawer;

	let teamId: string = $derived(page.url.searchParams.get('teamId') || '');
	let team: TeamDataModel | null = $state(null);

	function handleMore() {
		drawerRef && drawerRef.openDrawer();
	}

	async function loadTeams() {
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
				loadTeams();
			}
		}
	}

	onMount(() => {
		loadTeams();
	});
</script>

<div class="min-h-full">
	<AppNavbar title="VIEW PRODUCT" hasLogo hasTitle hasBack={isMobileScreen()} onBack={goBack} />
	<Drawer bind:this={drawerRef} className="border-r"><RestrictedDrawer /></Drawer>
	<Sidebar className="border-r "><RestrictedDrawer /></Sidebar>
	<ContentArea className="md:pl-72">
		<BackgroundGradient>
			<main>
				<div class="p-4 flex items-center justify-between">
					<div><h1 class="text-xl font-black">Teams Details</h1></div>
					<div>
						<Button appearance="border-primary" onClick={handleEdit} label="Edit" />
					</div>
				</div>
				<div class="pb-32">
					{#if team != null}
						<div class="bg-white p-4 shadow rounded-lg m-4">
							<TeamDetails {teamId} />
						</div>
					{/if}
				</div>
			</main>
		</BackgroundGradient>
	</ContentArea>
</div>
