<script lang="ts">
	import { onMount } from 'svelte';

	import { Button, IconCircle } from '@cloudparker/moldex.js';
	import { mdiInformationOutline, mdiPackageVariantClosed } from '$lib/core/services/app-icons-service';
	import type { VisitDataModel } from '../visite-type';
	import { getVisit } from '../visit-service';
	import TextUser from '$lib/user/components/text-user.svelte';
	import TextAttribute from '$lib/attribute/components/text-attribute.svelte';
	import { appState } from '$lib/core/services/app-state.svelte';
	import { openVisitsBasicDetailsDialog } from '../visite-ui-service';

	type Props = {
		visitId: any;
	};

	let { visitId }: Props = $props();
	let visit: VisitDataModel | null = $state(null);

	async function loadVisit() {
		if (visitId) {
			visit = await getVisit(visitId);
		} else {
			visit = null;
		}
	}

	async function handleOpenVisitsBasicInfoDialog(visit: VisitDataModel) {
		if (visit?._id) {
			await openVisitsBasicDetailsDialog(visit._id);
		}
	}

	onMount(() => {
		loadVisit();
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
			<h4 class="text-xl font-bold dark:text-base-200">Visit Details</h4>
		</div>
		<div class="flex justify-end">
			<Button
				iconPath={mdiInformationOutline}
				size="xs"
				onClick={() => handleOpenVisitsBasicInfoDialog(visit!)}
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
					><td>Title</td><td>{visit?.name || '-'}</td></tr
				>
				<tr><td>Description</td><td class="text-base-500 text-sm">{visit?.desc || '-'}</td></tr>
				<tr><td>Visit Type</td><td><TextAttribute input={visit?.type || '-'} /> </td></tr>
				<tr><td>Customer</td><td><TextUser input={visit?.customer || '-'} hideIcon /></td></tr>
				<tr
					><td>Planned</td><td
						>{#if visit?.isPlanned == true}
							Yes
						{:else}
							No
						{/if}</td
					></tr
				>
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
