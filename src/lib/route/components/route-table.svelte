<script lang="ts">
	import { ButtonMenu, Pagination, sort } from '@cloudparker/moldex.js';
	import { getAllRoutes } from '../route-service';
	import type { RouteDataModel } from '../route-types';
	import TextUser from '$lib/user/components/text-user.svelte';
	import { onMount } from 'svelte';

	type Props = {};
	let {}: Props = $props();

	let routes: RouteDataModel[] = $state([]);

	export async function loadRoutes() {
		let array = (await getAllRoutes()) || [];
		routes = sort({ array, field: 'name' });
	}

	export function handleMenu(ev: Event, menu: string, item: RouteDataModel) {}

	onMount(() => {
		loadRoutes();
	});
</script>

<div>
	<table class="min-w-full divide-y divide-gray-200 table-auto">
		<thead>
			<tr>
				<th class="text-left p-4">Name</th>
				<th class="text-left p-4">Manager</th>
				<th class="text-left p-4">Visit Plan</th>
				<th class="text-right p-4"></th>
			</tr>
		</thead>
		<tbody class="divide-y divide-gray-200">
			{#each routes as route, index}
				<tr class="hover:bg-base-100">
					<td class="text-left px-4">
						<div>
							{route.name || ''}
						</div>
						<div>
							{route.desc || ''}
						</div>
					</td>
					<td class="text-left px-4">
						<TextUser input={route.manager} hideIcon />
					</td>
					<td class="text-left px-4"></td>
					<td class="text-right px-4">
						<div class="flex justify-end">
							<ButtonMenu
								menus={['View', 'Edit', 'Delete']}
								onMenu={(ev, menu) => handleMenu(ev, menu as string, route)}
							/>
						</div>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
	<div class="p-4">
		<Pagination length={routes?.length} />
	</div>
</div>
