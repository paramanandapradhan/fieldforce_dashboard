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
	import type { UserDataModel } from '$lib/user/user-types';
	import TextUserSubtype from '$lib/user/components/text-user-subtype.svelte';

	type Props = {
		users?: UserDataModel[];
		onChange?: () => void;
	};

	let { users, onChange }: Props = $props();

	let paginatedUsers: UserDataModel[] = $state([]);
	let pageIndex: number = $state(0);
	let pageSize: number = $state(10);

	$effect(() => {
		const start = pageIndex * pageSize;
		const end = start + pageSize;
		paginatedUsers = (users ?? []).slice(start, end);
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

	async function handleDelete(item: UserDataModel) {
		if (item?._id && item?.team && (await openDeleteConfirmDialog())) {
			let loader = await openLoadingDialog();
			await updateUser(item._id, { team: '' } as UserDataModel);
			await syncUsers();
			loader.closeDialog();
			onChange && onChange();
		}
	}
</script>

<div>
	<table class="min-w-full divide-y divide-base-200 dark:divide-base-600 dark:text-base-200 table-fixed">
		<thead>
			<tr>
				<th class="text-left w-14"></th>
				<th class="text-left p-4">Name</th>
				<th class="text-left p-4">Type</th>
				<th class="text-left p-4">Email</th>
				<th class="text-left p-4">Phone</th>
				<th class="text-right p-4"></th>
			</tr>
		</thead>
		<tbody class="divide-y divide-base-200 dark:divide-base-600">
			{#each paginatedUsers || [] as item, index}
				<tr class="hover:bg-base-100 dark:hover:bg-base-700">
					<td class="text-left pl-4 py-1 w-14">
						<IconCircle
							iconPath={mdiBriefcaseAccount}
							iconClassName="!h-5 !w-5 text-primary"
							circleClassName="!h-10 !w-10"
						/>
					</td>
					<td class="text-left px-4">
						<div>
							<a href="/restricted/users/view?userId={item._id}" class="hover:text-primary">
								{item.name || ''}
							</a>
						</div>
						<div class="text-base-500 text-sm">
							{item.desc || ''}
						</div>
					</td>
					<td class="text-left px-4">
						<TextUserSubtype input={item?.subtype! || '-'} />
					</td>
					<td class="text-left px-4">
						{item.email || '-'}
					</td>
					<td class="text-left px-4">
						{item.phone || '-'}
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
			length={users?.length}
			{pageIndex}
			{pageSize}
			onPageSizeChange={handlePageSizeChange}
			onPageIndexChange={handlePageIndexChange}
		/>
	</div>
</div>
