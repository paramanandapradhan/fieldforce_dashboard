<script lang="ts">
	import {
		ButtonListItem,
		ButtonMenu,
		IconCircle,
		Loading,
		mdiDotsHorizontal,
		mdiMagnify,
		navigate,
		NoData,
		SearchField,
		sort
	} from '@cloudparker/moldex.js';
	import { getAllTeams } from '../team-service';
	import type { TeamDataModel } from '../team-type';
	import { openTeamDeleteDialog, openTeamEditDialog } from '../team-ui-service';
	import { onMount } from 'svelte';
	import WindowInfiniteScroll from '$lib/core/components/window-infinite-scroll.svelte';
	import {
	mdiAccountGroupOutline,
		mdiNotebookOutline,
		mdiPackageVariantClosed
	} from '$lib/core/services/app-icons-service';
	import { appState } from '$lib/core/services/app-state.svelte';

	let teams: TeamDataModel[] = $state([]);
	let pageIndex: number = $state(0);
	let pageSize: number = $state(10);
	let isLoading: boolean = $state(true);
	let searchText: string = $state('');

	let filteredTeams = $derived(
		teams.filter((team) =>
			searchText ? team.name?.toLowerCase().includes(searchText.toLowerCase()) : true
		)
	);
	let paginatedTeams = $derived(filteredTeams.slice(0, (pageIndex + 1) * pageSize));

	export async function loadTeams() {
		isLoading = true;
		let array = await getAllTeams();
		teams = sort({ array, field: 'name' });
		isLoading = false;
	}

	async function handleMenu(ev: MouseEvent, menu: string, team: TeamDataModel) {
		switch (menu) {
			case 'Edit':
				await openTeamEditDialog(team);
				await loadTeams();
				break;
			case 'Delete':
				await openTeamDeleteDialog(team);
				await loadTeams();
				break;
			case 'View':
				handleViewTeam(team);
				break;
		}
	}

	function handleViewTeam(team: TeamDataModel) {
		navigate(`/restricted/teams/view?teamId=${team._id}`);
	}

	// Infinite scrolling logic
	function loadMore() {
		pageIndex++;
	}

	onMount(() => {
		loadTeams();
	});
</script>

<WindowInfiniteScroll {loadMore} triggerDistance={500} side="bottom" />
<div class="p-4">
	<SearchField bind:value={searchText} placeholder="Search Teams..." />
</div>
<div>
	{#if isLoading}
		<Loading />
	{:else if searchText && filteredTeams.length <= 0}
		<NoData>
			<IconCircle
				iconPath={mdiMagnify}
				circleClassName="!bg-base-100 !w-12 !h-12"
				iconClassName="!w-6 !h-6 text-base-400"
			/>
			<div class="text-center text-base-400 text-sm mt-4">
				No search results found for "{searchText}"!.
			</div>
		</NoData>
	{:else if filteredTeams.length <= 0}
		<NoData>
			<IconCircle
				iconPath={mdiNotebookOutline}
				circleClassName="!bg-base-100 !w-12 !h-12"
				iconClassName="!w-6 !h-6 text-base-400"
			/>
			<div class="text-center text-base-400 text-sm mt-4">
				No Teams ! <br />Please add Teams!
			</div>
		</NoData>
	{:else}
		{#each paginatedTeams as team, index}
			<ButtonListItem onClick={() => handleViewTeam(team)} className="!pe-2">
				<div>
					<IconCircle
						iconPath={mdiAccountGroupOutline}
						iconClassName="!h-5 !w-5 text-primary"
						circleClassName="!h-10 !w-10"
					/>
				</div>
				<div class="flex-grow px-2">
					<div>
						{team.name || '-'}
					</div>
					<div class="text-base-500 text-sm">
						{team.desc || ''}
					</div>
				</div>
				<div class="flex justify-end">
					<ButtonMenu
					className="!px-2"
						menus={['View', 'Edit', 'Delete']}
						iconPath={mdiDotsHorizontal}
						onMenu={(ev, menu) => handleMenu(ev, menu as string, team)}
						iconClassName="text-base-400 hover:text-base-800 {appState.theme == 'light'
							? ''
							: 'dark:hover:text-base-200'}"
					/>
				</div>
			</ButtonListItem>
		{/each}
	{/if}
</div>
