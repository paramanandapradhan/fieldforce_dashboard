<script lang="ts">
	import {
		Button,
		CheckboxField,
		ColorField,
		ContentArea,
		Drawer,
		goBack,
		isMobileScreen,
		Sidebar
	} from '@cloudparker/moldex.js';
	import AppNavbar from '$lib/core/components/app-navbar.svelte';
	import BackgroundGradient from '$lib/core/components/background-gradient.svelte';
	import RestrictedDrawer from '$lib/drawer/components/restricted-drawer.svelte';
	import AgentDetails from '$lib/agent/components/agent-details-card.svelte';
	import AgentSelectType from '$lib/agent/components/agent-select-type.svelte';
	import KnowledgeCard from '$lib/knowledge/components/knowledge-card.svelte';
	import { page } from '$app/stores';
	import AgentDetailsCard from '$lib/agent/components/agent-details-card.svelte';
	import ActionCard from '$lib/action/components/action-card.svelte';
	import AgentVoicePreview from '$lib/agent/components/agent-voice-preview.svelte';
	import { onMount } from 'svelte';
	import type { AgentDataModel } from '$lib/agent/types/agent-types';
	import { openAgentEditDialog } from '$lib/agent/services/agent-ui-service';
	import { getAgent } from '$lib/agent/services/agent-service';

	let drawerRef: Drawer;
	let agentDetailsCardRef: AgentDetailsCard;
	let agent: AgentDataModel | null = $state(null);

	let agentId = $derived($page.url.searchParams.get('agentId') || '');

	// Load agents
	async function loadAgent() {
		if (agentId) {
			agent = await getAgent(agentId);
		}
	}

	// Update the agents according to its id
	async function handleEdit(ev: MouseEvent) {
		if (agent) {
			const res = await openAgentEditDialog(agent);
			if (res) {
				loadAgent();
			}
		}
	}

	onMount(() => {
		loadAgent();
	});
	function handleMore() {
		drawerRef && drawerRef.openDrawer();
	}
</script>

<div class="min-h-full">
	<AppNavbar title="VIEW AGENT" hasLogo hasTitle hasBack={isMobileScreen()} onBack={goBack} />
	<Drawer bind:this={drawerRef} className="border-r"><RestrictedDrawer /></Drawer>
	<Sidebar className="border-r "><RestrictedDrawer /></Sidebar>
	<ContentArea className="md:pl-72">
		<BackgroundGradient>
			<main class="pb-16">
				<div class="px-4 md:px-8 mt-4">
					<div class="flex flex-row items-start md:items-center justify-between gap-4">
						<div>
							<h1 class="text-lg md:text-xl font-bold text-base-800 dark:text-base-300">
								Agent Details
							</h1>
						</div>
						<div>
							<Button appearance="border-primary" onClick={handleEdit} label="Edit" />
						</div>
					</div>
				</div>
				<div class="px-4 md:px-8 mt-6">
					<AgentDetailsCard bind:this={agentDetailsCardRef} {agentId} />
				</div>
				<div class="px-4 md:px-8 mt-6">
					<!-- <div>
							<AgentSelectType />
						</div> -->
					<AgentVoicePreview {agentId} />
				</div>

				<!-- <div class="m-4">
					<AgentBasicKnowledge />
				</div> -->
				<div class="px-4 md:px-8 mt-6">
					<KnowledgeCard {agentId} />
				</div>
				<!-- <div class="m-8 pb-8">
					<ActionCard {agentId} />
				</div> -->
			</main>
		</BackgroundGradient>
	</ContentArea>
</div>
