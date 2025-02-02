<script lang="ts">
	import {
		Button,
		ButtonListItem,
		ButtonMenu,
		Icon,
		IconCircle,
		mdiDotsHorizontal,
		NoData,
		sort,
		TextDate
	} from '@cloudparker/moldex.js';
	import { increment } from 'firebase/firestore';
	import { getAllCalls, syncCalls, updateCall } from '../call-service';
	import { CallStatusEnum, type CallDataModel } from '../call-types';
	import { onMount } from 'svelte';
	import { openCallDeleteDialog } from '../call-ui-service';
	import TextCallType from './text-call-type.svelte';
	import TextCallStatus from './text-call-status.svelte';
	import {
		mdiAlphaT,
		mdiArrowBottomLeft,
		mdiArrowLeft,
		mdiArrowRightThin,
		mdiArrowTopRight,
		mdilArrowRight,
		mdiNotebookOutline,

		mdiPhone

	} from '$lib/core/services/app-icons-service';

	let calls: CallDataModel[] = $state([]);
	let expanded: { items: { [key: string]: string } } = $state({ items: {} });
	let searchText: string = $state('');

	export function search(search: string) {
		searchText = search;
	}

	export async function loadCalls() {
		calls = (await getAllCalls()) || [];
		calls = sort({ array: calls, field: 'date', isDate: true });
	}

	async function handleReady() {
		await loadCalls();
	}

	async function handleMenu(ev: Event, menu: string, call: CallDataModel) {
		switch (menu) {
			case 'Meter ++':
				incrementMeter(call);
				break;
			case 'End Call':
				endCall(call);
				break;
			case 'Delete':
				deleteCall(call);
				break;
			default:
				break;
		}
	}

	async function deleteCall(call: CallDataModel) {
		await openCallDeleteDialog(call);
		loadCalls();
	}

	async function incrementMeter(call: CallDataModel) {
		if (call?._id) {
			await updateCall(call._id, { meter: increment(1) });
			await syncCalls();
			await loadCalls();
		}
	}

	async function endCall(call: CallDataModel) {
		if (call?._id) {
			await updateCall(call._id, { status: CallStatusEnum.ENDED });
			await syncCalls();
			await loadCalls();
		}
	}

	onMount(() => {
		loadCalls();
	});
</script>

<div
	class=" bg-white dark:bg-base-700 text-base-800 dark:text-base-300 shadow-lg rounded-lg p-4 pt-4 pb-12 overflow-x-auto"
>
	{#if calls.length === 0}
		<!-- No Call History Message -->
		<NoData>
			<IconCircle
				iconPath={mdiPhone}
				circleClassName="!bg-base-100 !w-12 !h-12"
				iconClassName="!w-6 !h-6 text-base-400"
			/>
			<div class="text-center text-base-400 dark:text-base-300 text-sm mt-4">
				No call history present
			</div>
		</NoData>
	{:else}
		<!-- Call History Table -->
		<table class="w-full">
			<thead class="bg-base-50 dark:bg-base-800 text-base-800 dark:text-base-200">
				<tr>
					<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"></th>
					<th class="py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
					<th class=" py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
					<th class=" py-3 text-left text-xs font-medium uppercase tracking-wider">Agent</th>
					<th class=" py-3 text-left text-xs font-medium uppercase tracking-wider">Duration</th>
					<th class=" py-3 text-left text-xs font-medium uppercase tracking-wider">Charges</th>
					<th></th>
					<th></th>
				</tr>
			</thead>
			<tbody class="divide-y divide-base-200 dark:divide-base-700">
				{#each calls as call (call._id)}
					<tr class="hover:bg-base-50 dark:hover:bg-base-600 text-base-800 dark:text-base-300">
						<td class="px-6 py-2 text-sm">
							<IconCircle
								iconPath={mdiArrowBottomLeft}
								iconClassName="!h-4 !w-4 "
								circleClassName="!bg-green-500"
							/>
							<!-- <Icon path={mdiArrowTopRight} className="!h-4 !w-4 text-blue-500"/> -->
						</td>
						<td class="py-2 text-sm">
							<div class="flex gap-2 items-center text-center">
								<div title="From">{call?.from || ''}</div>
								<Icon path={mdilArrowRight} className="!h-6 !w-6 text-green-500" />
								<div title="To">{call?.to || ''}</div>
							</div>
							<div class="mt-4">
								<TextDate input={call?.date || ''} />
							</div>
						</td>

						<td class=" py-2 text-sm">
							<TextCallStatus input={call?.status || ''} />
							<span title="Call Type">(<TextCallType input={call?.type || ''} />)</span>
						</td>
						<td class=" py-2 text-sm">{call?.agent || 'Agent-1'}</td>
						<td class=" py-2 text-sm">{call?.duration || '10 min'}</td>

						<td class="py-2 text-sm text-center">{call?.meter || ''}</td>
						<td>
							<Button>
								<Icon path={mdiAlphaT} />
							</Button>
						</td>
						<td class=" py-2 text-sm">
							<ButtonMenu
								menus={['Meter ++', 'End Call', 'Delete']}
								iconPath={mdiDotsHorizontal}
								iconClassName="text-base-400 hover:text-base-800"
								onMenu={(ev, menu) => handleMenu(ev, menu as string, call)}
							/>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</div>
