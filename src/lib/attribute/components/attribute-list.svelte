<script lang="ts">
	import AuthAttributeReady from '$lib/auth/components/auth-user-ready.svelte';
	import { Button, ButtonListItem, ButtonMenu, Pagination } from '@cloudparker/moldex.js';
	import { getAllAttributes } from '../attribute-service';
	import type { AttributeDataModel } from '../attribute-types';
	import {
		openAttributeDeleteDialog,
		openAttributeDetailsDialog,
		openAttributeEditDialog
	} from '../attribute-ui-service';
	import TextAttributeType from './text-attribute-type.svelte';
	import { mdiInformationOutline } from '$lib/core/services/app-icons-service';
	import { appState } from '$lib/core/services/app-state.svelte';

	let attributes: AttributeDataModel[] = $state([]);
	let paginatedAttribute: AttributeDataModel[] = $state([]);
	let pageIndex: number = $state(0);
	let pageSize: number = $state(10);

	export async function loadAttributes() {
		attributes = (await getAllAttributes()) || [];
	}

	function handleReady() {
		loadAttributes();
	}

	async function handleMenu(ev: MouseEvent, menu: string, attr: AttributeDataModel) {
		switch (menu) {
			case 'Edit':
				await openAttributeEditDialog({
					attribute: attr,
					attributeType: attr.type!
				});
				await loadAttributes();
				break;
			case 'Delete':
				await openAttributeDeleteDialog(attr);
				await loadAttributes();
				break;
		}
	}

	async function handleItemClick(ev: MouseEvent, attr: AttributeDataModel) {
		if (attr?._id) {
			await openAttributeDetailsDialog(attr._id);
		}
	}

	$effect(() => {
		const start = pageIndex * pageSize;
		const end = start + pageSize;
		paginatedAttribute = attributes.slice(start, end);
	});

	// Handle page index changes
	function handlePageIndexChange(newPageIndex: number) {
		pageIndex = newPageIndex;
	}

	// Handle page size changes
	function handlePageSizeChange(newPageSize: number) {
		pageSize = newPageSize;
		pageIndex = 0;
	}
</script>

<AuthAttributeReady onReady={handleReady} />
<div>
	{#each paginatedAttribute as attr, index}
		<ButtonListItem>
			<div></div>
			<div class="flex-grow">
				<div>{attr.name || ''}</div>
				<div class="text-sm text-base-400">{attr.desc || ''}</div>
			</div>
			<div>
				<span class="text-sm font-bold text-base-400">
					<TextAttributeType input={attr.type} />
				</span>
			</div>
			<div>
				<Button
					iconPath={mdiInformationOutline}
					size="xs"
					onClick={(ev) => handleItemClick(ev, attr)}
					iconClassName="text-base-400 hover:text-base-800 {appState.theme == 'light'
						? ''
						: 'dark:hover:text-base-200'}"
				/>
			</div>
			<div>
				<ButtonMenu
					menus={['Edit', 'Delete']}
					onMenu={(ev, menu) => handleMenu(ev, menu as string, attr)}
					iconClassName="text-base-400 hover:text-base-800 {appState.theme == 'light'
						? ''
						: 'dark:hover:text-base-200'}"
					size="xs"
				/>
			</div>
		</ButtonListItem>
		<hr />
	{/each}
</div>
<div class="p-4">
	<Pagination
		length={attributes?.length}
		{pageIndex}
		{pageSize}
		onPageSizeChange={handlePageSizeChange}
		onPageIndexChange={handlePageIndexChange}
	/>
</div>
