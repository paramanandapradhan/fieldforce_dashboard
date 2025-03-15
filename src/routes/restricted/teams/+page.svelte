<script lang="ts">
	import AppNavbar from '$lib/core/components/app-navbar.svelte';
	import BackgroundGradient from '$lib/core/components/background-gradient.svelte';
	import { mdiSync } from '$lib/core/services/app-icons-service';
	import RestrictedDrawer from '$lib/drawer/components/restricted-drawer.svelte';
	import TeamList from '$lib/teams/components/team-list.svelte';
	import TeamTable from '$lib/teams/components/team-table.svelte';
	import { syncTeams } from '$lib/teams/team-service';
	import { openTeamEditDialog } from '$lib/teams/team-ui-service';
	import {
		Button,
		ContentArea,
		Drawer,
		isMobileScreen,
		screenSize,
		Sidebar
	} from '@cloudparker/moldex.js';

	let drawerRef: Drawer;
	let teamTableRef: TeamTable;
	let teamListRef: TeamList;

	let isSyncInProgress = $state(false);

	function handleMore() {
		drawerRef && drawerRef.openDrawer();
	}

	async function handleAddTeam() {
		let res = await openTeamEditDialog();
		if (res) {
			loadTeams();
		}
	}

	async function loadTeams() {
		teamTableRef && teamTableRef.loadTeams();
		teamListRef && teamListRef.loadTeams();
	}

	async function handleSync() {
		isSyncInProgress = true;
		await syncTeams();
		await loadTeams();
		isSyncInProgress = false;
	}
</script>

<div class="min-h-full">
	<AppNavbar hasLogo hasTitle hasMore={isMobileScreen()} onMore={handleMore} />
	<Drawer bind:this={drawerRef} className="border-r"><RestrictedDrawer /></Drawer>
	<Sidebar className="border-r "><RestrictedDrawer /></Sidebar>
	<ContentArea className="md:pl-72">
		<BackgroundGradient>
			<main>
				<div class="pb-32">
					<div class="p-4 flex flex-wrap items-center gap-4">
						<div class="flex-grow"><h1 class="text-xl font-black dark:text-base-200">Teams</h1></div>
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
								onClick={handleAddTeam}
								label="Add Team"
								className="w-full sm:w-auto"
							/>
						</div>
					</div>
					<div class="m-4 p-4 bg-white dark:bg-base-800 shadow rounded-lg">
						{#if screenSize.isSm || screenSize.isMd || screenSize.isXs}
							<TeamList bind:this={teamListRef} />
						{:else}
							<TeamTable bind:this={teamTableRef} />
						{/if}
					</div>
				</div>
			</main>
		</BackgroundGradient>
	</ContentArea>
</div>
