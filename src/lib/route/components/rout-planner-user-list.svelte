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

	const weekdayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

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
	{#each items as item}
		<div class="my-4">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-3">
					<IconCircle
						iconPath={mdiAccount}
						iconClassName="!h-5 !w-5 text-primary"
						circleClassName="!h-10 !w-10"
					/>
					<TextUser input={item.userId} hideIcon  itemClass="dark:text-base-200"/>
				</div>
				<Button iconPath={mdiDeleteOutline} onClick={() => handleDelete(item)}></Button>
			</div>
			<div class="grid grid-cols-7 gap-4 mt-4 text-center">
				{#each Array(7)
					.fill(0)
					.map((_, day) => day) as day}
					<div class="flex flex-col items-center">
						<span class="text-sm font-bold dark:text-base-400">{weekdayLabels[day]}</span>
						<Button
							className="!h-12 !w-12"
							iconPath={item[day] ? mdiCheck : mdiCircleSmall}
							iconClassName="!h-6 !w-6"
							onClick={() => handleToggleCheck(item, day)}
						></Button>
					</div>
				{/each}
			</div>
		</div>
	{/each}
</div>
