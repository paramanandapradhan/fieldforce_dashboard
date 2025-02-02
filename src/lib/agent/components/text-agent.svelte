<script lang="ts">
	import { getAgent } from '../services/agent-service';

	type Props = {
		input?: string;
	};

	let { input }: Props = $props();

	let agentPromise = $derived.by(async () => {
		if (input) {
			return await getAgent(input);
		}
	});
</script>

{#await agentPromise then agent}
	<span>{agent?.name || ''}</span>
{/await}
