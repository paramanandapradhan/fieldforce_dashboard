<script lang="ts">
	import { ButtonMenu, IconCircle, Pagination, sort } from '@cloudparker/moldex.js';

	import { mdiBriefcaseAccount, mdiMapMarkerPath } from '$lib/core/services/app-icons-service';
	import { onMount } from 'svelte';
	import { getAllUsers, UserTypeEnum } from '../user-service';
	import type { CustomerDataModel } from '../user-types';
	import TextUserSubtype from './text-user-subtype.svelte';
	import TextAttribute from '$lib/attribute/components/text-attribute.svelte';

	type Props = {};
	let {}: Props = $props();

	let customers: CustomerDataModel[] = $state([]);

	export async function loadCustomers() {
		let array =
			((await getAllUsers({ type: UserTypeEnum.USER_TYPE_CUSTOMER })) as CustomerDataModel[]) || [];
		customers = sort({ array, field: 'name' });
	}

	export function handleMenu(ev: Event, menu: string, item: CustomerDataModel) {}

	onMount(() => {
		loadCustomers();
	});
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
			{#each customers as item, index}
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
							<a href="/restricted/customers/view?routeId={item._id}" class="hover:text-primary">
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
							<ButtonMenu
								menus={['View', 'Edit', 'Delete']}
								onMenu={(ev, menu) => handleMenu(ev, menu as string, item)}
							/>
						</div>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
	<div class="p-4">
		<Pagination length={customers?.length} />
	</div>
</div>
