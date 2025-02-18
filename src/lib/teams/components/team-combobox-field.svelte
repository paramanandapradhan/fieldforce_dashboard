<script lang="ts">
	import {
		ComboboxField,
		sort,
		type ComboboxFieldProps,
		type InputFieldProps
	} from '@cloudparker/moldex.js';

	import AuthUserReady from '$lib/auth/components/auth-user-ready.svelte';
	import { getAllTeams } from '../team-service';
	import { openTeamEditDialog } from '../team-ui-service';
	import type { TeamDataModel } from '../team-type';

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

	let teams: TeamDataModel[] = $state([]);

	let createButtonLabel = $derived.by(() => {
		return `Add ${label}`;
	});

	export async function loadTeams() {
		let array = (await getAllTeams()) as TeamDataModel[];
		teams = sort({ array, field: 'name' });
	}

	async function handleReady() {
		await loadTeams();
	}

	async function handelCreate() {
		console.log('handelCreate');

		let res = await openTeamEditDialog();
		if (res) {
			loadTeams();
		}
	}
</script>

<AuthUserReady onReady={handleReady} />
<ComboboxField
	bind:value
	items={teams}
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
