<script lang="ts">
	import AgentDetails from './agent-details.svelte';

	type Props = {
		agentId: string;
	};

	let { agentId }: Props = $props();
</script>

<div class="h-full">
	<AgentDetails {agentId} />
</div>
