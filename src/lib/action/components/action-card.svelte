<script lang="ts">
	import { Button, SearchField } from '@cloudparker/moldex.js';
	import ActionList from './action-list.svelte';
	import { openActionEditDialog } from '../action-ui-service';
	

	type Props = {
		agentId: string;
	};

	let { agentId }: Props = $props();

	let actionListRef: ActionList;
	let actionCount:number = $state(0);
	let searchText: string = $state('');

	async function handleAddaction() {
		let res = await openActionEditDialog({agentId})
		if(res){
			actionListRef.laodActions()
		}
	}

	function getActionsCount(){
		actionCount = actionListRef.actionCount()
	}

	$effect(() => {
		getActionsCount()
	})
</script>

<div class="rounded-md bg-white dark:bg-base-700 shadow p-6">
	<div class="flex items-center gap-4 mb-6">
		<div class="flex-grow">
			<h2 class="text-lg font-bold text-base-800 dark:text-base-300">Agent Actions <span class="text-base-400">({actionCount})</span></h2>
		</div>
		<div class="">
			<Button appearance="border-primary" label="Add Actions" onClick={handleAddaction} />
		</div>
	</div>
	<div class="w-72 my-4">
		<SearchField bind:value={searchText} />
	</div>
	<div>
		<ActionList bind:this={actionListRef} {agentId} {searchText}/>
	</div>
</div>
