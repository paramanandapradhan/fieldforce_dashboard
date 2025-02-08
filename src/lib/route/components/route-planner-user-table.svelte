<script lang="ts">
	import { Button, openDeleteConfirmDialog, readFileAsBuffer } from '@cloudparker/moldex.js';
	import type { RouteDataModel } from '../route-types';
	import { openUserPickerDialog } from '$lib/user/user-ui-service';
	import { UserTypeEnum } from '$lib/user/user-service';
	import { syncRoutes, updateRoute } from '../route-service';
	import TextUser from '$lib/user/components/text-user.svelte';
	import { mdiCheck, mdiDeleteOutline } from '$lib/core/services/app-icons-service';
	import { deleteField, FieldValue } from 'firebase/firestore';

	type Props = {
		route: RouteDataModel;
		onChange?: () => void;
	};

	let { route, onChange }: Props = $props();

	let items: { userId: string }[] = $derived.by(() => {
		return Object.keys(route.plans || {}).map((key) => {
			let weekdays: { [day: number]: boolean } = {
				0: false,
				1: false,
				2: false,
				3: false,
				4: false,
				5: false,
				6: false,
				7: false
			};

			if (route.plans) {
				(route.plans[key] || []).forEach((value: number) => {
					weekdays[value] = true;
				});
			}

			let user = {
				userId: key,
				...weekdays
			};

			return user;
		});
	});

	async function handleDelete(item: any) {
		if (item?.userId && route._id && (await openDeleteConfirmDialog())) {
			await updateRoute(route._id, { [`plans.${item.userId}`]: deleteField() });
			await syncRoutes();
			onChange && onChange();
		}
	}
</script>

<div>
	<table class="min-w-full divide-y divide-base-200 table-fixed">
		<thead>
			<tr>
				<th class="text-left p-4"></th>
				<th class="text-left p-4">User</th>
				<th class="text-left p-4">Sun</th>
				<th class="text-left p-4">Mon</th>
				<th class="text-left p-4">Tue</th>
				<th class="text-left p-4">Wed</th>
				<th class="text-left p-4">Thu</th>
				<th class="text-left p-4">Fri</th>
				<th class="text-left p-4">Sat</th>
				<td></td>
			</tr>
		</thead>
		<tbody class="divide-y divide-base-200">
			{#each items as item, index}
				<tr>
					<td></td>
					<td class="text-left"><TextUser input={item.userId} hideIcon /></td>
					<td>
						<Button iconPath={mdiCheck}></Button>
					</td>
					<td>
						<Button iconPath={mdiCheck}></Button>
					</td>
					<td>
						<Button iconPath={mdiCheck}></Button>
					</td>
					<td>
						<Button iconPath={mdiCheck}></Button>
					</td>
					<td>
						<Button iconPath={mdiCheck}></Button>
					</td>
					<td>
						<Button iconPath={mdiCheck}></Button>
					</td>
					<td>
						<Button iconPath={mdiCheck}></Button>
					</td>
					<td>
						<Button iconPath={mdiDeleteOutline} onClick={() => handleDelete(item)}></Button>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
