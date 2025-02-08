<script lang="ts">
	import {
		ComboboxField,
		sort,
		type ComboboxFieldProps,
		type InputFieldProps
	} from '@cloudparker/moldex.js';

	import AuthUserReady from '$lib/auth/components/auth-user-ready.svelte';
	import { getAllRoutes } from '../route-service';
	import type { RouteDataModel } from '../route-types';
	import { openRouteEditDialog } from '../route-ui-service';

	type Props = {
		value?: string | string[] | null;
	};

	let {
		value = $bindable(null),
		titleFieldName = 'name',
		subtitleFieldName = 'desc',
		displayFieldName = 'name',
		searchFieldName = 'name',
		identityFieldName = '_id',
		hasDropdownHeader = true,
		hasDropdownHeaderSearch = true,
		hasDropdownFooter = true,
		hasDropdownFooterCreateButton = true,
		label,
		...props
	}: ComboboxFieldProps & InputFieldProps & Props = $props();

	let routes: RouteDataModel[] = $state([]);

	let createButtonLabel = $derived.by(() => {
		return `Add ${label}`;
	});

	export async function loadRoutes() {
		let array = (await getAllRoutes()) as RouteDataModel[];
		routes = sort({ array, field: 'name' });
	}

	async function handleReady() {
		await loadRoutes();
	}

	async function handelCreate() {
		console.log('handelCreate');

		let res = await openRouteEditDialog();
		if (res) {
			loadRoutes();
		}
	}
</script>

<AuthUserReady onReady={handleReady} />
<ComboboxField
	bind:value
	items={routes}
	{label}
	{titleFieldName}
	{subtitleFieldName}
	{displayFieldName}
	{searchFieldName}
	{identityFieldName}
	{hasDropdownHeader}
	{hasDropdownHeaderSearch}
	{hasDropdownFooter}
	{hasDropdownFooterCreateButton}
	{createButtonLabel}
	dropdownFooterClassName="border-t"
	createButtonClassName="border-primary text-primary hover:text-primary"
	onCreateButtonClick={handelCreate}
	{...props}
/>
