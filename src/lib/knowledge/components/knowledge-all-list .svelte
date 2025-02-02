<script lang="ts">
	import { ButtonMenu, IconCircle, Loading, NoData, Pagination } from '@cloudparker/moldex.js';
	import { getAllKnowledges } from '../knowledge-service';
	import type { KnowledgeDataModel } from '../knowledge-types';
	import TextAttribute from '$lib/attribute/components/text-attribute.svelte';
	import { openKnowledgeDeleteDialog, openKnowledgeEditDialog } from '../knowledge-ui-service';
	import { onMount } from 'svelte';
	import { mdiNotebookOutline } from '$lib/core/services/app-icons-service';

	type Props = {
		agentId?: string;
	};

	let { agentId }: Props = $props();

	let knowledges: KnowledgeDataModel[] = $state([]);
	// let paginatedKnowledges: KnowledgeDataModel[] = $state([]);

	// let pageIndex: number = $state(0);
	// let pageSize: number = $state(5);
	let isLoading: boolean = $state(true);

	export async function loadKnowledges() {
		isLoading = true;
		knowledges = await getAllKnowledges({ agent: agentId });
		isLoading = false;
	}

	async function handleMenu(ev: Event, menu: string, knowledge: KnowledgeDataModel) {
		switch (menu) {
			case 'Edit':
				await openKnowledgeEditDialog({ knowledge, agentId });
				await loadKnowledges();
				break;
			case 'Delete':
				await openKnowledgeDeleteDialog(knowledge);
				await loadKnowledges();
				break;
		}
	}

	// $effect(() => {
	// 	const start = pageIndex * pageSize;
	// 	const end = start + pageSize;
	// 	paginatedKnowledges = knowledges.slice(start, end);
	// });

	// Handle page index changes
	// function handlePageIndexChange(newPageIndex: number) {
	// 	pageIndex = newPageIndex;
	// }

	// Handle page size changes
	// function handlePageSizeChange(newPageSize: number) {
	// 	pageSize = newPageSize;
	// 	pageIndex = 0;
	// }

	export function knowledgeCount() {
		return knowledges.length;
	}

	onMount(() => {
		if (agentId) {
			loadKnowledges();
		}
	});
</script>

<div class="">
	{#if isLoading}
		<Loading />
	{:else if knowledges?.length <= 0}
		<NoData>
			<IconCircle
				iconPath={mdiNotebookOutline}
				circleClassName="!bg-base-100 !w-12 !h-12"
				iconClassName="!w-6 !h-6 text-base-400"
			/>
			<div class="text-center text-base-400 text-sm">
				No Knowledges ! <br />Please add agent knowledge!
			</div>
		</NoData>
	{:else}
		{#each knowledges as kn, index}
			<div class="flex my-1 p-4 bg-base-50 dark:bg-base-600 text-base-800 dark:text-base-300 rounded-sm">
				<div class="flex-grow">
					<div class="font-bold">
						<TextAttribute input={kn.topic} />
					</div>
					<div>
						{kn.text}
					</div>
				</div>
				<div>
					<ButtonMenu
						menus={['Edit', 'Delete']}
						onMenu={(ev, menu) => handleMenu(ev, menu as string, kn)}
					/>
				</div>
			</div>
		{/each}
		<!-- <div class="my-6">
			<Pagination
				length={knowledges.length}
				{pageIndex}
				{pageSize}
				disbaleSizeMenuButton={true}
				onPageSizeChange={handlePageSizeChange}
				onPageIndexChange={handlePageIndexChange}
			/>
		</div> -->
	{/if}
</div>
