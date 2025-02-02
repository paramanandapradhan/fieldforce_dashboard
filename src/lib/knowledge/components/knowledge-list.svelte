<script lang="ts">
	import {
		Button,
		ButtonMenu,
		Icon,
		IconCircle,
		Loading,
		NoData,
		Pagination,
		TextDate
	} from '@cloudparker/moldex.js';
	import { getAllKnowledges } from '../knowledge-service';
	import type { KnowledgeDataModel } from '../knowledge-types';
	import TextAttribute from '$lib/attribute/components/text-attribute.svelte';
	import {
		openKnowledgeDeleteDialog,
		openknowledgeDetailsDialog,
		openKnowledgeEditDialog
	} from '../knowledge-ui-service';
	import { onMount } from 'svelte';
	import {
		mdiClockOutline,
		mdiInformationOutline,
		mdiMagnify,
		mdiNotebookOutline
	} from '$lib/core/services/app-icons-service';

	type Props = {
		agentId?: string;
		searchText?: string;
	};

	let { agentId, searchText }: Props = $props();

	let knowledges: KnowledgeDataModel[] = $state([]);
	let paginatedKnowledges: KnowledgeDataModel[] = $state([]);
	let filteredKnowledges: KnowledgeDataModel[] = $state([]);
	let selectedTopics: string[] = $state([]);

	let pageIndex: number = $state(0);
	let pageSize: number = $state(5);
	let isLoading: boolean = $state(true);
	let expandedKnowledges: Record<string, boolean> = $state({});

	export async function loadKnowledges() {
		isLoading = true;
		knowledges = await getAllKnowledges({ agent: agentId });
		isLoading = false;
	}

	// function updatePaginatedKnowledges() {
	// 	const start = pageIndex * pageSize;
	// 	const end = start + pageSize;
	// 	paginatedKnowledges = knowledges.slice(start, end);
	// }

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

	// Filter by searchText and selectedTopics
	$effect(() => {
		filteredKnowledges = knowledges.filter((knowledge) => {
			const matchesSearch = searchText
				? knowledge.text?.toLowerCase().includes(searchText.toLowerCase())
				: true;
			const matchesTopics = selectedTopics.length
				? selectedTopics.includes(knowledge.topic!)
				: true;
			return matchesSearch && matchesTopics;
		});

		pageIndex = 0;
	});

	$effect(() => {
		const start = pageIndex * pageSize;
		const end = start + pageSize;
		paginatedKnowledges = filteredKnowledges.slice(start, end);
	});

	export function filterByTopics(topics: any) {
		selectedTopics = topics;
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

	export function knowledgeCount() {
		return knowledges.length;
	}

	function toggleExpand(knowledgeId: string, ev: MouseEvent) {
		ev.preventDefault();
		expandedKnowledges[knowledgeId] = !expandedKnowledges[knowledgeId];
	}

	async function handleAgentKnowledgeDetails(ev: MouseEvent, knowledge: KnowledgeDataModel) {
		ev.preventDefault();
		if (agentId && knowledge._id) {
			await openknowledgeDetailsDialog({ knowledge, agentId });
		}
	}
	onMount(() => {
		if (agentId) {
			loadKnowledges();
		}
	});
</script>

<div class="w-full">
	{#if isLoading}
		<Loading />
	{:else if searchText && filteredKnowledges.length <= 0}
		<NoData>
			<IconCircle
				iconPath={mdiMagnify}
				circleClassName="!bg-base-100 !w-12 !h-12"
				iconClassName="!w-6 !h-6 text-base-400"
			/>
			<div class="text-center text-base-400 text-sm mt-4">
				No search results found for "{searchText}"!.
			</div>
		</NoData>
	{:else if filteredKnowledges?.length <= 0}
		<NoData>
			<IconCircle
				iconPath={mdiNotebookOutline}
				circleClassName="!bg-base-100 !w-12 !h-12"
				iconClassName="!w-6 !h-6 text-base-400"
			/>
			<div class="text-center text-base-400 text-sm mt-4">
				No Knowledges ! <br />Please add agent knowledge!
			</div>
		</NoData>
	{:else}
		{#each paginatedKnowledges as kn, index}
			<div
				class="flex flex-col sm:flex-row my-2 p-4 bg-base-50 dark:bg-base-600 hover:bg-base-100 text-base-800 dark:text-base-300 rounded-sm"
			>
				<div class="min-w-full sm:min-w-16  font-mono text-sm text-base-500">{kn._id}</div>
				<div class="flex-grow mt-4 sm:mt-0">
					<div class="font-bold">
						<TextAttribute input={kn.topic} />
					</div>
					<div class="truncate hover:whitespace-normal hover:overflow-visible my-4 text-base-600 dark:text-base-300 text-sm leading-relaxed">
						{#each kn.text!.split('\n') as text (text)}
							<div>{text}</div>
						{/each}
					</div>
				</div>
				<div class="text-end">
					<Button
						iconPath={mdiInformationOutline}
						iconClassName="text-base-400 hover:text-base-800"
						onClick={(ev) => handleAgentKnowledgeDetails(ev, kn)}
					/>
				</div>
				<div class="flex justify-end ">
					<ButtonMenu
						menus={['Edit', 'Delete']}
						onMenu={(ev, menu) => handleMenu(ev, menu as string, kn)}
						iconClassName="text-base-400 hover:text-base-800"
					/>
				</div>
			</div>
		{/each}
		<div class="my-6">
			<Pagination
				length={filteredKnowledges.length}
				{pageIndex}
				{pageSize}
				disbaleSizeMenuButton={true}
				onPageSizeChange={handlePageSizeChange}
				onPageIndexChange={handlePageIndexChange}
			/>
		</div>
	{/if}
</div>
