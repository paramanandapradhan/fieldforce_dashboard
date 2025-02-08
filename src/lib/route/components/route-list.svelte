<script lang="ts">
	import { ButtonListItem, ButtonMenu, IconCircle, sort } from '@cloudparker/moldex.js';
	import { getAllRoutes } from '../route-service';
	import type { RouteDataModel } from '../route-types';
	import TextUser from '$lib/user/components/text-user.svelte';
	import { onMount } from 'svelte';
	import { mdiMapMarkerPath } from '$lib/core/services/app-icons-service';

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
	{#each routes as route, index}
		<ButtonListItem>
			<div>
				<IconCircle
					iconPath={mdiMapMarkerPath}
					iconClassName="!h-5 !w-5 text-primary"
					circleClassName="!h-10 !w-10"
				/>
			</div>
			<div class="flex-grow px-2">
				<div>
					{route.name || ''}
				</div>
				<div class="text-base-500 text-sm">
					{route.desc || ''}
				</div>
			</div>
			<div>
				<ButtonMenu
					menus={['View', 'Edit', 'Delete']}
					onMenu={(ev, menu) => handleMenu(ev, menu as string, route)}
				/>
			</div>
		</ButtonListItem>
	{/each}
</div>
