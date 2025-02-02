<script lang="ts">
	import { onMount } from 'svelte';
	import { getAllActions } from '../action-service';
	import type { ActionDataModel } from '../action-types';
	import { openActionDeleteDialog, openActionEditDialog } from '../action-ui-service';
	import {
		ButtonMenu,
		Icon,
		IconCircle,
		Loading,
		NoData,
		Pagination,
		TextDate
	} from '@cloudparker/moldex.js';
	import {
		mdiClockOutline,
		mdiNotebookOutline,
		mdiNoteOutline
	} from '$lib/core/services/app-icons-service';

	type Props = {
		agentId?: string;
		searchText?: string;
	};

	let { agentId, searchText }: Props = $props();

	let actions: ActionDataModel[] = $state([]);
	let paginatedActions: ActionDataModel[] = $state([]);
	let filteredActions: ActionDataModel[] = $state([]);

	let pageIndex: number = $state(0);
	let pageSize: number = $state(5);
	let isLoading: boolean = $state(true);
	let expandedActions: Record<string, boolean> = $state({});

	export async function laodActions() {
		isLoading = true;
		actions = await getAllActions({ agent: agentId });
		isLoading = false;
	}
	async function handleMenu(ev: Event, menu: string, action: ActionDataModel) {
		switch (menu) {
			case 'Edit':
				await openActionEditDialog({ action, agentId });
				await laodActions();
				break;
			case 'Delete':
				await openActionDeleteDialog(action);
				await laodActions();
				break;
		}
	}

	$effect(() => {
		if (searchText) {
			filteredActions = actions.filter((actions) =>
				actions.desc?.toLowerCase().includes(searchText.toLowerCase())
			);
		} else {
			filteredActions = actions;
		}
		pageIndex = 0;
	});
	$effect(() => {
		const start = pageIndex * pageSize;
		const end = start + pageSize;
		paginatedActions = filteredActions.slice(start, end);
	});

	function handlePageIndexChange(newPageIndex: number) {
		pageIndex = newPageIndex;
	}

	// Handle page size changes
	function handlePageSizeChange(newPageSize: number) {
		pageSize = newPageSize;
		pageIndex = 0;
	}

	export function actionCount() {
		return actions.length;
	}

	function toggleExpand(actionId: string, ev: MouseEvent) {
		ev.preventDefault();
		expandedActions[actionId] = !expandedActions[actionId];
	}
	onMount(() => {
		if (agentId) {
			laodActions();
		}
	});
</script>

<div>
	{#if isLoading}
		<Loading />
	{:else if filteredActions?.length <= 0}
		<NoData>
			<IconCircle
				iconPath={mdiNotebookOutline}
				circleClassName="!bg-base-100 !w-12 !h-12"
				iconClassName="!w-6 !h-6 text-base-400"
			/>
			<div class="text-center text-base-400 text-sm">
				No Actions ! <br />Please add agent action!
			</div>
		</NoData>
	{:else}
		{#each paginatedActions as action, index}
			<div
				class="flex my-1 p-4 bg-base-50 dark:bg-base-600 text-base-800 dark:text-base-300 rounded-sm"
			>
				<div class="me-2">{action._id}</div>
				<div class="flex-grow">
					<div class="font-bold">
						{action.name}
					</div>
					<div>
						{action.desc}

						<div class="flex gap-6 mt-4 mb-2 items-center">
							<div class="flex gap-2 items-center" title="Created Date">
								<div>
									<Icon path={mdiClockOutline} className="!w-5 !h-5" />
								</div>
								<div><TextDate input={action?.cat} /></div>
							</div>
							<div class="flex gap-2 items-center" title="Updated Date">
								<div>
									<Icon path={mdiClockOutline} className="!w-5 !h-5" />
								</div>
								<div><TextDate input={action?.uat} /></div>
							</div>
						</div>
					</div>
				</div>
				<div>
					<ButtonMenu
						menus={['Edit', 'Delete']}
						onMenu={(ev, menu) => handleMenu(ev, menu as string, action)}
					/>
				</div>
			</div>
		{/each}
		<div class="my-6">
			<Pagination
				length={actions.length}
				{pageIndex}
				{pageSize}
				disbaleSizeMenuButton={true}
				onPageSizeChange={handlePageSizeChange}
				onPageIndexChange={handlePageIndexChange}
			/>
		</div>
	{/if}
</div>
