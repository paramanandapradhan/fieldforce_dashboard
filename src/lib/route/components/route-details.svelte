<script lang="ts">
	import TextUser from '$lib/user/components/text-user.svelte';
	import type { RouteDataModel } from '../route-types';

	type Props = {
		route?: RouteDataModel;
	};

	let { route }: Props = $props();
</script>

<div>
	<table>
		<tbody>
			<tr class="text-lg font-bold"><td>Route Name</td><td>:</td><td>{route?.name || '-'}</td></tr>
			<tr
				><td>Description</td><td>:</td><td class="text-base-500 text-sm">{route?.desc || '-'}</td
				></tr
			>
			<tr><td>Manager</td><td>:</td><td> <TextUser input={route?.manager} hideIcon /></td></tr>
		</tbody>
	</table>
</div>

<style>
</style>
