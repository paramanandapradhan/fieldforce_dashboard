<script lang="ts">
	import { Button, navigate, SearchField } from '@cloudparker/moldex.js';
	import { openKnowledgeEditDialog } from '../knowledge-ui-service';

	import { onMount } from 'svelte';
	import KnowledgeList from './knowledge-list.svelte';
	import { mdiFileTreeOutline, mdiFilterOutline } from '$lib/core/services/app-icons-service';
	import type { KnowledgeDataModel } from '../knowledge-types';
	import { openAttributePickerDialog } from '$lib/attribute/attribute-ui-service';
	import { AttributeTypeEnum } from '$lib/attribute/attribute-service';

	type Props = {
		agentId: string;
	};

	let { agentId }: Props = $props();

	let knowledgeListRef: KnowledgeList;
	let knowledgeCount: number = $state(0);
	let searchText: string = $state('');

	async function handleAddKnowledge() {
		let res = await openKnowledgeEditDialog({ agentId });
		if (res) {
			await knowledgeListRef.loadKnowledges();
			getKnowledgeCount();
		}
	}

	function getKnowledgeCount() {
		if (knowledgeListRef) {
			knowledgeCount = knowledgeListRef.knowledgeCount();
		}
	}

	async function handleKnowledgeFilter() {
		let selectedTopics = await openAttributePickerDialog({
			attributeType: AttributeTypeEnum.KNOWLEDGE_TOPIC,
			multiple: true
		});

		if (selectedTopics) {
			knowledgeListRef.filterByTopics(selectedTopics);
		}
	}

	$effect(() => {
		if (knowledgeListRef) {
			getKnowledgeCount();
		}
	});
</script>

<div class="rounded-md bg-white dark:bg-base-700 shadow p-6">
	<div class="flex flex-col md:flex-row items-center gap-4 mb-6">
		<div class="flex-grow text-center md:text-left">
			<h2 class="text-lg font-bold text-base-800 dark:text-base-300">
				Agent Knowledge <span class="text-base-400">({knowledgeCount})</span>
			</h2>
		</div>
		<div class="w-full md:w-auto flex justify-center md:justify-end">
			<Button appearance="border-primary" label="Add Knowledge" onClick={handleAddKnowledge} className="w-full sm:w-auto" />
		</div>
	</div>
	<div class="flex gap-8 items-center">
		<div class="w-72 my-4">
			<SearchField bind:value={searchText} />
		</div>
		<div>
			<Button
				appearance="base"
				iconPath={mdiFilterOutline}
				onClick={handleKnowledgeFilter}
				iconClassName="text-base-400 hover:text-base-600"
			/>
		</div>
	</div>
	<div class="mt-4">
		<KnowledgeList bind:this={knowledgeListRef} {agentId} {searchText} />
	</div>
</div>
