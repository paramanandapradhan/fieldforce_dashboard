<script lang="ts">
	import { onMount } from 'svelte';
	import { getAllTeams } from '../team-service';
	import type { TeamDataModel } from '../team-type';
	import {
		openTeamBasicDetailsDialog,
		openTeamDeleteDialog,
		openTeamEditDialog
	} from '../team-ui-service';
	import {
		Button,
		ButtonMenu,
		IconCircle,
		Loading,
		mdiDotsHorizontal,
		navigate,
		NoData,
		Pagination,
		SearchField,
		sort
	} from '@cloudparker/moldex.js';
	import {
		mdiAccount,
		mdiAccountGroupOutline,
		mdiInformationOutline,
		mdiMagnify,
		mdiNotebookOutline,
		mdiPackageVariantClosed
	} from '$lib/core/services/app-icons-service';
	import { appState } from '$lib/core/services/app-state.svelte';
	import TextUser from '$lib/user/components/text-user.svelte';

	let teams: TeamDataModel[] = $state([]);
	let pageIndex: number = $state(0);
	let pageSize: number = $state(10);
	let searchText: string = $state('');
	let isLoading: boolean = $state(true);

	let filteredTeams = $derived(
		teams.filter((item) => {
			const matchSearch = searchText
				? item.name?.toLowerCase().includes(searchText.toLowerCase())
				: true;
			return matchSearch;
		})
	);

	let paginatedTeams = $derived(
		filteredTeams.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)
	);

	$effect(() => {
		searchText;
		pageIndex = 0;
	})

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

	// Handle page index changes
	function handlePageIndexChange(newPageIndex: number) {
		pageIndex = newPageIndex;
	}

	// Handle page size changes
	function handlePageSizeChange(newPageSize: number) {
		pageSize = newPageSize;
		pageIndex = 0;
	}

	async function handleOpenTeamBasicInfoDialog(team: TeamDataModel) {
		if (team?._id) {
			await openTeamBasicDetailsDialog(team._id);
		}
	}

	onMount(() => {
		loadTeams();
	});
</script>

<div>
	<div class="p-4 max-w-72">
		<SearchField bind:value={searchText} placeholder="Search Teams..." />
	</div>

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
		<table
			class="min-w-full divide-y divide-base-200 dark:divide-base-600 dark:text-base-200 table-fixed"
		>
			<thead>
				<tr>
					<th class="text-left w-14"></th>
					<th class="text-left p-4">Name</th>
					<th class="text-left p-4">Manager</th>
					<th class="text-right"></th>
				</tr>
			</thead>
			<tbody class="divide-y divide-base-200 dark:divide-base-600">
				{#each paginatedTeams as team, index}
					<tr>
						<td class="text-left pl-4 py-1 w-14">
							<IconCircle
								iconPath={mdiAccountGroupOutline}
								iconClassName="!h-5 !w-5 text-primary"
								circleClassName="!h-10 !w-10"
							/>
						</td>
						<td class="text-left px-4">
							<div>
								<a href="/restricted/teams/view?teamId={team._id}" class="hover:text-primary">
									{team.name || '-'}
								</a>
							</div>
							<div class="text-sm text-base-500">{team.desc || '-'}</div>
						</td>
						<td class="text-left px-4"><TextUser input={team?.manager} hideIcon /></td>
						<td class="text-left">
							<div class="flex justify-end">
								<Button
									className="!px-2"
									iconPath={mdiInformationOutline}
									size="xs"
									onClick={() => handleOpenTeamBasicInfoDialog(team)}
									iconClassName="text-base-400 hover:text-base-800 {appState.theme == 'light'
										? ''
										: 'dark:hover:text-base-200'}"
								/>

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
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
		<div class="p-4">
			<Pagination
				length={filteredTeams?.length}
				{pageIndex}
				{pageSize}
				onPageSizeChange={handlePageSizeChange}
				onPageIndexChange={handlePageIndexChange}
			/>
		</div>
	{/if}
</div>
