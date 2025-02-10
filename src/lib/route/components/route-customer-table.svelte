<script lang="ts">
	import {
		Button,
		IconCircle,
		openDeleteConfirmDialog,
		openLoadingDialog,
		Pagination
	} from '@cloudparker/moldex.js';

	import TextAttribute from '$lib/attribute/components/text-attribute.svelte';
	import { mdiBriefcaseAccount, mdiDeleteOutline } from '$lib/core/services/app-icons-service';

	import { syncUsers, updateUser } from '$lib/user/user-service';
	import type { CustomerDataModel } from '$lib/user/user-types';
	import TextUserSubtype from '$lib/user/components/text-user-subtype.svelte';

	type Props = {
		customers?: CustomerDataModel[];
		onChange?: () => void;
	};

	let { customers, onChange }: Props = $props();

	let paginatedCustomers: CustomerDataModel[] = $state([]);
	let pageIndex: number = $state(0);
	let pageSize: number = $state(10);

	$effect(() => {
		const start = pageIndex * pageSize;
		const end = start + pageSize;
		paginatedCustomers = (customers ?? []).slice(start, end);
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

	async function handleDelete(item: CustomerDataModel) {
		if (item?._id && item?.master?.route && (await openDeleteConfirmDialog())) {
			let loader = await openLoadingDialog();
			await updateUser(item._id, { 'master.route': '' } as CustomerDataModel);
			await syncUsers();
			loader.closeDialog();
			onChange && onChange();
		}
	}
</script>

<div>
	<table class="min-w-full divide-y divide-base-200 table-fixed">
		<thead>
			<tr>
				<th class="text-left w-14"></th>
				<th class="text-left p-4">Name</th>
				<th class="text-left p-4">Type</th>
				<th class="text-left p-4">City</th>
				<th class="text-left p-4">Area</th>
				<th class="text-right p-4"></th>
			</tr>
		</thead>
		<tbody class="divide-y divide-base-200">
			{#each paginatedCustomers || [] as item, index}
				<tr class="hover:bg-base-100">
					<td class="text-left pl-4 py-1 w-14">
						<IconCircle
							iconPath={mdiBriefcaseAccount}
							iconClassName="!h-5 !w-5 text-primary"
							circleClassName="!h-10 !w-10"
						/>
					</td>
					<td class="text-left px-4">
						<div>
							<a href="/restricted/items/view?routeId={item._id}" class="hover:text-primary">
								{item.name || ''}
							</a>
						</div>
						<div class="text-base-500 text-sm">
							{item.desc || ''}
						</div>
					</td>
					<td class="text-left px-4">
						<TextUserSubtype input={item.subtype} />
					</td>
					<td class="text-left px-4">
						<TextAttribute input={item?.geo?.city} />
					</td>
					<td class="text-left px-4">
						<TextAttribute input={item?.geo?.area} />
					</td>
					<td class="text-right px-4">
						<div class="flex justify-end">
							<Button iconPath={mdiDeleteOutline} onClick={() => handleDelete(item)} />
						</div>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
	<div class="p-4">
		<Pagination
			length={customers?.length}
			{pageIndex}
			{pageSize}
			onPageSizeChange={handlePageSizeChange}
			onPageIndexChange={handlePageIndexChange}
		/>
	</div>
</div>
