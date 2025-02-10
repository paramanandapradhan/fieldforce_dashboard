<script lang="ts">
	import TextUser from '$lib/user/components/text-user.svelte';
	import { ButtonListItem, screenSize } from '@cloudparker/moldex.js';
	import type { RouteDataModel } from '../route-types';

	type Props = {
		route?: RouteDataModel;
	};

	let { route }: Props = $props();
</script>

<div>
	<table>
		<tbody>
			<tr class="lg:text-lg lg:font-bold font-semibold"
				><td>Route Name</td><td>{route?.name || '-'}</td></tr
			>
			<tr><td>Description</td><td class="text-base-500 text-sm">{route?.desc || '-'}</td></tr>
			<tr><td>Manager</td><td> <TextUser input={route?.manager} hideIcon /></td></tr>
		</tbody>
	</table>
</div>

<style>
	td:nth-child(1) {
		color: var(--color-base-400);
		width: 180px;
	}
	td:nth-child(2) {
		color: var(--color-base-500);
		width: 180px;
	}
</style>
