<script lang="ts">
	import { onMount } from 'svelte';
	import { getTeam } from '../team-service';
	import type { TeamDataModel } from '../team-type';
	import { IconCircle } from '@cloudparker/moldex.js';
	import { mdiPackageVariantClosed } from '$lib/core/services/app-icons-service';
	import TextUser from '$lib/user/components/text-user.svelte';

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

	onMount(() => {
		loadTeam();
	});
</script>

<div>
	<h4 class="text-xl font-bold mb-4">Team Details</h4>
	<div class="flex md:flex-row flex-col gap-4">
		<div>
			<IconCircle
				iconPath={mdiPackageVariantClosed}
				iconClassName="text-primary"
				circleClassName=" "
			/>
		</div>
		<div>
			<table class="table-fixed w-full">
				<tbody>
					<tr class="lg:text-lg lg:font-bold font-semibold"
						><td>Name</td><td>{team?.name || '-'}</td></tr
					>
					<tr><td>Description</td><td class="text-base-500 text-sm">{team?.desc || '-'}</td></tr>
					<tr><td>Manager</td><td> <TextUser input={team?.manager} /></td></tr>
				</tbody>
			</table>
		</div>
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
