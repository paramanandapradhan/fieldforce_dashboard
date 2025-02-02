<script lang="ts">
	import type { KnowledgeDataModel } from '../knowledge-types';
	import KnowledgeDetails from './knowledge-details.svelte';

	type Props = {
		agentId: string;
		knowledge: KnowledgeDataModel;
	};

	let { agentId,knowledge }: Props = $props();
</script>

<div class="h-full">
	<KnowledgeDetails {agentId} {knowledge}/>
</div>
