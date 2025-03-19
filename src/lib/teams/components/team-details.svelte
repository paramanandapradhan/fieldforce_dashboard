<script lang="ts">
	import { onMount } from 'svelte';
	import { getTeam } from '../team-service';
	import type { TeamDataModel } from '../team-type';
	import { Button, IconCircle } from '@cloudparker/moldex.js';
	import { mdiInformationOutline, mdiPackageVariantClosed } from '$lib/core/services/app-icons-service';
	import TextUser from '$lib/user/components/text-user.svelte';
	import { appState } from '$lib/core/services/app-state.svelte';
	import { openTeamBasicDetailsDialog } from '../team-ui-service';

	type Props = {
		teamId: any;
	};

	let { teamId }: Props = $props();
	let team: TeamDataModel | null = $state(null);

	async function loadTeam() {
		if (teamId) {
			team = await getTeam(teamId);
		} else {
			team = null;
		}
	}

	async function handleOpenTeamBasicInfoDialog(team: TeamDataModel) {
		if (team?._id) {
			await openTeamBasicDetailsDialog(team._id);
		}
	}

	onMount(() => {
		loadTeam();
	});
</script>

<div>
	<div class="flex items-center gap-4">
		<div>
			<IconCircle
				iconPath={mdiPackageVariantClosed}
				iconClassName="text-primary"
				circleClassName=" "
			/>
		</div>
		<div class="flex-grow">
			<h4 class="text-xl font-bold dark:text-base-200">Team Details</h4>
		</div>
		<div class="flex justify-end">
			<Button
				iconPath={mdiInformationOutline}
				size="xs"
				onClick={() => handleOpenTeamBasicInfoDialog(team!)}
				iconClassName="text-base-400 hover:text-base-800 {appState.theme == 'light'
					? ''
					: 'dark:hover:text-base-200'}"
			/>
		</div>
	</div>

	<div class="mt-6">
		<table class="table-fixed w-full">
			<tbody>
				<tr class="lg:text-lg lg:font-bold font-semibold"
					><td>Name</td><td>{team?.name || '-'}</td></tr
				>
				<tr><td>Description</td><td class="text-base-500 text-sm">{team?.desc || '-'}</td></tr>
				<tr><td>Manager</td><td> <TextUser input={team?.manager} hideIcon /></td></tr>
			</tbody>
		</table>
	</div>
</div>

<style>
	td:nth-child(1) {
		color: var(--color-base-400);
		width: 180px;
	}
	td:nth-child(2) {
		color: var(--color-base-500);
		height: 40px;
		width: auto;
		max-width: 500px;
		word-wrap: break-word;
		overflow-wrap: break-word;
	}

	/* Responsive adjustments for small screens */
	@media (max-width: 768px) {
		td:nth-child(1) {
			width: 100px; /* Further reduce width on small screens */
		}
		td:nth-child(2) {
			max-width: 100%; /* Allow full width on small screens */
			padding-left: 8px; /* Reduce left padding for tighter spacing */
		}
	}
</style>
