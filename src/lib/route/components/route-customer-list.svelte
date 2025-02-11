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

	export let customers: CustomerDataModel[] = [];
	export let onChange: (() => void) | undefined;

	let paginatedCustomers: CustomerDataModel[] = [];
	let pageIndex: number = 0;
	let pageSize: number = 10;

	$: {
		const start = pageIndex * pageSize;
		const end = start + pageSize;
		paginatedCustomers = (customers ?? []).slice(start, end);
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

<!-- Mobile List View -->
<div>
	{#each paginatedCustomers as item}
		<div class="my-8">
			<div class="flex justify-between">
                <div class="flex gap-3">
                    <IconCircle
                        iconPath={mdiBriefcaseAccount}
                        iconClassName="!h-5 !w-5 text-primary"
                        circleClassName="!h-10 !w-10"
                    />
                    <div class="flex-grow">
                        <div class="text-lg font-semibold">
                            <a href="/restricted/customers/view?customerId={item._id}" class="hover:text-primary">
                                {item.name || ''}
                            </a>
                        </div>
                        <div class="text-sm text-base-500">{item.desc || ''}</div>
                    </div>
                </div>
				<Button iconPath={mdiDeleteOutline} onClick={() => handleDelete(item)} />
			</div>
			<div class="mt-3">
				<p><strong>Type:</strong> <TextUserSubtype input={item.subtype} /></p>
				<p><strong>City:</strong> <TextAttribute input={item?.geo?.city} /></p>
				<p><strong>Area:</strong> <TextAttribute input={item?.geo?.area} /></p>
			</div>
		</div>
	{/each}
</div>

<!-- Pagination -->
<div class="p-4">
	<Pagination
		length={customers?.length}
		{pageIndex}
		{pageSize}
		onPageSizeChange={handlePageSizeChange}
		onPageIndexChange={handlePageIndexChange}
	/>
</div>
