<script lang="ts">
	import AuthAttributeReady from '$lib/auth/components/auth-user-ready.svelte';
	import {
		Button,
		ButtonListItem,
		ButtonMenu,
		IconCircle,
		Loading,
		mdiMagnify,
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
</script>

<AuthAttributeReady onReady={handleReady} />
<div>
	<div class="p-4 max-w-80">
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
		<table
			class="min-w-full divide-y divide-base-200 dark:divide-base-600 dark:text-base-200 table-fixed"
		>
			<thead>
				<tr>
					<th class="text-left w-14"></th>
					<th class="text-left p-4">Name</th>
					<th class="text-left p-4">Type</th>
					<th class="text-right"></th>
				</tr>
			</thead>
			<tbody class="divide-y divide-base-200 dark:divide-base-600">
				{#each paginatedAttribute as attr, index}
					<tr>
						<td class="text-left pl-4 py-1 w-14">
							<IconCircle
								iconPath={mdiFormatListBulleted}
								iconClassName="!h-5 !w-5 text-primary"
								circleClassName="!h-10 !w-10"
							/>
						</td>
						<td class="text-left px-4">
							<div>
								<a href="/restricted/attributes/view?attributeId={attr._id}" class="hover:text-primary">
									{attr.name || '-'}
								</a>
							</div>
							<div class="text-sm text-base-500">{attr.desc || '-'}</div>
						</td>
						<td class="text-left px-4"><TextAttributeType input={attr.type} /></td>
						<td class="text-left">
							<div class="flex justify-end gap-2">
								<Button
									iconPath={mdiInformationOutline}
									size="xs"
									onClick={(ev) => handleItemClick(ev, attr)}
									iconClassName="text-base-400 hover:text-base-800 {appState.theme == 'light'
										? ''
										: 'dark:hover:text-base-200'}"
								/>

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
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
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
