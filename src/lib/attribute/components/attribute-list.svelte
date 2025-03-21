<script lang="ts">
	import AuthAttributeReady from '$lib/auth/components/auth-user-ready.svelte';
	import {
		Button,
		ButtonListItem,
		ButtonMenu,
		IconCircle,
		Loading,
		mdiMagnify,
		navigate,
		NoData,
		Pagination,
		SearchField,
		sort
	} from '@cloudparker/moldex.js';
	import { attributeTypeConfigs, AttributeTypeEnum, getAllAttributes } from '../attribute-service';
	import type { AttributeDataModel } from '../attribute-types';
	import {
		openAttributeDeleteDialog,
		openAttributeDetailsDialog,
		openAttributeEditDialog
	} from '../attribute-ui-service';
	import TextAttributeType from './text-attribute-type.svelte';
	import {
		mdiFormatListBulleted,
		mdiInformationOutline,
		mdiNotebookOutline
	} from '$lib/core/services/app-icons-service';
	import { appState } from '$lib/core/services/app-state.svelte';

	let attributes: AttributeDataModel[] = $state([]);
	let pageIndex: number = $state(0);
	let pageSize: number = $state(10);
	let searchText: string = $state('');
	let isLoading: boolean = $state(true);

	// Map enum values to their labels
	const attributeTypeMap = new Map(
		attributeTypeConfigs.map((config) => [config._id, config.label])
	);

	// Derived state for filtered attributes
	const filteredAttribute = $derived(
		attributes.filter((attribute) => {
			const nameMatch = searchText
				? attribute.name?.toLowerCase().includes(searchText.toLowerCase())
				: true;
			const typeLabel = attributeTypeMap.get(attribute.type) || '';
			const typeMatch = searchText
				? typeLabel.toLowerCase().includes(searchText.toLowerCase())
				: true;
			return nameMatch || typeMatch;
		})
	);

	// Derived state for paginated attributes
	const paginatedAttribute = $derived(
		filteredAttribute.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)
	);

	export async function loadAttributes() {
		isLoading = true;
		let array = (await getAllAttributes()) || [];
		attributes = sort({ array, field: 'name' });
		isLoading = false;
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

	// Handle page index changes
	function handlePageIndexChange(newPageIndex: number) {
		pageIndex = newPageIndex;
	}

	// Handle page size changes
	function handlePageSizeChange(newPageSize: number) {
		pageSize = newPageSize;
		pageIndex = 0;
	}

	function handleViewAttribute(attr: AttributeDataModel) {
		navigate(`/restricted/attributes/view?attributeId=${attr._id}`);
	}
</script>

<AuthAttributeReady onReady={handleReady} />
<div>
	<div class="p-4">
		<SearchField bind:value={searchText} placeholder="Search Attribute Name or Type..." />
	</div>
	{#if isLoading}
		<Loading />
	{:else if searchText && filteredAttribute.length <= 0}
		<NoData>
			<IconCircle
				iconPath={mdiMagnify}
				circleClassName="!bg-base-100 !w-12 !h-12"
				iconClassName="!w-6 !h-6 text-base-400"
			/>
			<div class="text-center text-base-400 text-sm mt-4">
				No search results found for "{searchText}"!.
			</div>
		</NoData>
	{:else if filteredAttribute.length <= 0}
		<NoData>
			<IconCircle
				iconPath={mdiNotebookOutline}
				circleClassName="!bg-base-100 !w-12 !h-12"
				iconClassName="!w-6 !h-6 text-base-400"
			/>
			<div class="text-center text-base-400 text-sm mt-4">
				No Products ! <br />Please add Products!
			</div>
		</NoData>
	{:else}
		{#each paginatedAttribute as attr, index}
			<ButtonListItem onClick={() => handleViewAttribute(attr)} className="!pe-2">
				<div>
					<IconCircle
						iconPath={mdiFormatListBulleted}
						iconClassName="!h-5 !w-5 text-primary"
						circleClassName="!h-10 !w-10"
					/>
				</div>

				<div class="flex-grow">
					<div>{attr.name || ''}</div>
					<!-- <div class="text-sm text-base-400">{attr.desc || ''}</div> -->
					<div class="text-sm text-base-400"><TextAttributeType input={attr.type} /></div>
				</div>
				<div>
					<ButtonMenu
						className="!px-2"
						menus={['Edit', 'Delete']}
						onMenu={(ev, menu) => handleMenu(ev, menu as string, attr)}
						iconClassName="text-base-400 hover:text-base-800 {appState.theme == 'light'
							? ''
							: 'dark:hover:text-base-200'}"
					/>
				</div>
			</ButtonListItem>
		{/each}
		<div class="p-4">
			<Pagination
				length={filteredAttribute?.length}
				{pageIndex}
				{pageSize}
				onPageSizeChange={handlePageSizeChange}
				onPageIndexChange={handlePageIndexChange}
			/>
		</div>
	{/if}
</div>
