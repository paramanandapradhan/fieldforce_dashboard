<script lang="ts">
	import { onMount } from 'svelte';

	import { IconCircle } from '@cloudparker/moldex.js';
	import { mdiPackageVariantClosed } from '$lib/core/services/app-icons-service';
	import type { VisitDataModel } from '../visite-type';
	import { getVisit } from '../visit-service';
	import TextUser from '$lib/user/components/text-user.svelte';
	import TextAttribute from '$lib/attribute/components/text-attribute.svelte';

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

	onMount(() => {
		loadVisit();
	});
</script>

<div>
	<h4 class="text-xl font-bold mb-4">Tour Visit Details</h4>
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
						><td>Title</td><td>{visit?.name || '-'}</td></tr
					>
					<tr><td>Description</td><td class="text-base-500 text-sm">{visit?.desc || '-'}</td></tr>
					<tr><td>Visit Type</td><td><TextAttribute input={visit?.type || '-'} /> </td></tr>
					<tr><td>Customer</td><td><TextUser input={visit?.customer || '-'}  hideIcon/></td></tr>
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
