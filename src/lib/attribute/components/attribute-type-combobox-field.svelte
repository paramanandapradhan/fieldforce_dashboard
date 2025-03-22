<script lang="ts">
	import AuthUserReady from '$lib/auth/components/auth-user-ready.svelte';
	import {
		ComboboxField,
		sort,
		type ComboboxFieldProps,
		type InputFieldProps
	} from '@cloudparker/moldex.js';
	import {
		attributeTypeConfigs
	} from '../attribute-service';
	import type { AttributeDataModel, AttributeTypeConfig } from '../attribute-types';

	type Props = {
		value?: string | string[] | null;
	};

	let {
		value = $bindable(null),
		titleFieldName = 'label',
		displayFieldName = 'label',
		searchFieldName = 'label',
		identityFieldName = '_id',
		hasDropdownHeader = true,
		hasDropdownHeaderSearch = true,
		hasDropdownFooter = true,
		hasDropdownFooterCreateButton = true,

		onChange,
		...props
	}: ComboboxFieldProps & InputFieldProps & Props = $props();

	let types: AttributeDataModel[] = $state([]);

	export async function loadAttributes() {
		let array: AttributeTypeConfig[] = await JSON.parse(JSON.stringify(attributeTypeConfigs));
		types = sort({ array, field: 'label' });
	}

	async function handleReady() {
		await loadAttributes();
	}
</script>

<AuthUserReady onReady={handleReady} />
<ComboboxField
	bind:value
	items={types}
	{titleFieldName}
	{displayFieldName}
	{searchFieldName}
	{identityFieldName}
	{hasDropdownHeader}
	{hasDropdownHeaderSearch}
	dropdownFooterClassName="border-t"
	createButtonClassName="border-primary text-primary hover:text-primary"
	{onChange}
	{...props}
/>
