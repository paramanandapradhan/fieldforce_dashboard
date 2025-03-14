<script lang="ts">
	import {
		Button,
		IconCircle,
		openDeleteConfirmDialog,
		openLoadingDialog,
		readFileAsBuffer
	} from '@cloudparker/moldex.js';
	import type { RouteDataModel } from '../route-types';
	import { openUserPickerDialog } from '$lib/user/user-ui-service';
	import { UserTypeEnum } from '$lib/user/user-service';
	import { syncRoutes, updateRoute } from '../route-service';
	import TextUser from '$lib/user/components/text-user.svelte';
	import {
		mdiAccount,
		mdiCheck,
		mdiCircleSmall,
		mdiDeleteOutline
	} from '$lib/core/services/app-icons-service';
	import { arrayRemove, arrayUnion, deleteField, FieldValue } from 'firebase/firestore';

	type Props = {
		route: RouteDataModel;
		onChange?: () => void;
	};

	let { route, onChange }: Props = $props();

	let items: any[] = $derived.by(() => {
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
			let loader = await openLoadingDialog();
			await updateRoute(route._id, { [`plans.${item.userId}`]: deleteField() });
			await syncRoutes();
			onChange && onChange();
			loader.closeDialog();
		}
	}

	async function handleToggleCheck(item: any, day: number) {
		if (item && day != null && route._id) {
			let loader = await openLoadingDialog();
			let value = item[day] ? arrayRemove(day) : arrayUnion(day);
			await updateRoute(route._id, { [`plans.${item.userId}`]: value });
			await syncRoutes();
			onChange && onChange();
			loader.closeDialog();
		}
	}
</script>

<div>
	<table class="min-w-full divide-y divide-base-200 dark:divide-base-500 dark:text-base-200 table-fixed">
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
		<tbody class="divide-y divide-base-200 dark:divide-base-500">
			{#each items as item, index}
				<tr class="hover:bg-base-100 dark:hover:bg-base-700">
					<td class="text-left pl-4 py-1 w-14">
						<IconCircle
							iconPath={mdiAccount}
							iconClassName="!h-5 !w-5 text-primary"
							circleClassName="!h-10 !w-10"
						/>
					</td>
					<td class="text-left px-4"><TextUser input={item.userId} hideIcon /></td>
					<td class="text-left px-4">
						<Button
							iconPath={item[0] ? mdiCheck : mdiCircleSmall}
							onClick={() => handleToggleCheck(item, 0)}
						></Button>
					</td>
					<td class="text-left px-4">
						<Button
							iconPath={item[1] ? mdiCheck : mdiCircleSmall}
							onClick={() => handleToggleCheck(item, 1)}
						></Button>
					</td>
					<td class="text-left px-4">
						<Button
							iconPath={item[2] ? mdiCheck : mdiCircleSmall}
							onClick={() => handleToggleCheck(item, 2)}
						></Button>
					</td>
					<td class="text-left px-4">
						<Button
							iconPath={item[3] ? mdiCheck : mdiCircleSmall}
							onClick={() => handleToggleCheck(item, 3)}
						></Button>
					</td>
					<td class="text-left px-4">
						<Button
							iconPath={item[4] ? mdiCheck : mdiCircleSmall}
							onClick={() => handleToggleCheck(item, 4)}
						></Button>
					</td>
					<td class="text-left px-4">
						<Button
							iconPath={item[5] ? mdiCheck : mdiCircleSmall}
							onClick={() => handleToggleCheck(item, 5)}
						></Button>
					</td>
					<td class="text-left px-4">
						<Button
							iconPath={item[6] ? mdiCheck : mdiCircleSmall}
							onClick={() => handleToggleCheck(item, 6)}
						></Button>
					</td>
					<td class="px-4">
						<div class="flex justify-end">
							<Button iconPath={mdiDeleteOutline} onClick={() => handleDelete(item)}></Button>
						</div>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
