<script lang="ts">
	import { ButtonListItem, ButtonMenu, sort } from '@cloudparker/moldex.js';
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
	{#each routes as route, index}
		<ButtonListItem
			title={route.name || ''}
			subtitle={route.desc || ''}
			hasMenu={true}
			menus={['View', 'Edit', 'Delete']}
			onMenu={(ev, menu) => handleMenu(ev, menu as string, route)}
		/>
	{/each}
</div>
