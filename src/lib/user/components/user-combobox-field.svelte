<script lang="ts">
	import AuthUserReady from '$lib/auth/components/auth-user-ready.svelte';
	import {
		ComboboxField,
		sort,
		type ComboboxFieldProps,
		type InputFieldProps
	} from '@cloudparker/moldex.js';

	import type { UserDataModel, UserSubtypeEnum, UserTypeEnum } from '../user-types';
	import { getAllUsers } from '../user-service';
	import { openUserEditDialog } from '../user-ui-service';

	type Props = {
		userType: UserTypeEnum;
		userSubtype: UserSubtypeEnum;
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
		userType,
		userSubtype,
		label,
		...props
	}: ComboboxFieldProps & InputFieldProps & Props = $props();

	let users: UserDataModel[] = $state([]);

	let createButtonLabel = $derived.by(() => {
		return `Add ${label}`;
	});

	export async function loadUsers() {
		let array = (await getAllUsers({ type: userType, subtype: userSubtype })) as UserDataModel[];
		users = sort({ array, field: 'name' });
	}

	async function handleReady() {
		await loadUsers();
	}

	async function handelCreate() {
		console.log('handelCreate');
		if (userType) {
			let res = await openUserEditDialog({ subtype: userSubtype });
			if (res) {
				loadUsers();
			}
		}
	}
</script>

<AuthUserReady onReady={handleReady} />
<ComboboxField
	bind:value
	items={users}
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
