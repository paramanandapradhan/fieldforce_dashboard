<script lang="ts">
	import AuthUserReady from '$lib/auth/components/auth-user-ready.svelte';
	import {
		ComboboxField,
		sort,
		type ComboboxFieldProps,
		type InputFieldProps
	} from '@cloudparker/moldex.js';
	import {
		getAllAttributes,
		getAttributeTypeConfig,
		type AttributeTypeEnum
	} from '../attribute-service';
	import type { AttributeDataModel } from '../attribute-types';
	import { openAttributeEditDialog } from '../attribute-ui-service';

	type Props = {
		parent?: string;
		attributeType: AttributeTypeEnum;
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
		attributeType,
		parent,
		onChange,
		...props
	}: ComboboxFieldProps & InputFieldProps & Props = $props();

	let attributes: AttributeDataModel[] = $state([]);
	let createButtonLabel = $derived.by(() => {
		let typeConfig = getAttributeTypeConfig(attributeType);
		if (typeConfig) {
			return `Add ${typeConfig.label}`;
		}
		return 'Add';
	});

	export async function loadAttributes() {
		let array = await getAllAttributes({ type: attributeType!, parent });
		attributes = sort({ array, field: 'name' });
	}

	async function handleReady() {
		await loadAttributes();
	}

	async function handelCreate() {
		console.log('handelCreate');
		if (attributeType) {
			let res = await openAttributeEditDialog({ attributeType: attributeType!, parent });
			if (res) {
				loadAttributes();
			}
		}
	}
</script>

<AuthUserReady onReady={handleReady} />
<ComboboxField
	bind:value
	items={attributes}
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
	{onChange}
	{...props}
/>
