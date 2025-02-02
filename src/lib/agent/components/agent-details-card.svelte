<script lang="ts">
	import AuthUserReady from '$lib/auth/components/auth-user-ready.svelte';
	import { Button, Icon, IconCircle, mdiPhone, TextDate } from '@cloudparker/moldex.js';
	import { getAgent } from '../services/agent-service';
	import type { AgentDataModel } from '../types/agent-types';
	import { openAgentDetailsDialog, openAgentEditDialog } from '../services/agent-ui-service';
	import {
		mdiClockOutline,
		mdiFaceAgent,
		mdiFaceMan,
		mdiFaceWoman,
		mdiInformationOutline,
		mdiPencil
	} from '$lib/core/services/app-icons-service';
	import { getContext, onMount } from 'svelte';
	import { appState } from '$lib/core/services/app-state.svelte';
	import { getAllKnowledges } from '$lib/knowledge/knowledge-service';

	type Props = {
		agentId: string;
	};

	let { agentId }: Props = $props();

	let agent: AgentDataModel | null = $state(null);
	let knowledgeCounts: Record<string, number> = $state({});

	let isReady = $state(false);

	// Load the agents according to its id
	export async function loadAgent() {
		if (agentId) {
			try {
				agent = await getAgent(agentId);

				if (agent && agent._id) {
					const knowledges = await getAllKnowledges({agent:agent?._id});
					knowledgeCounts = { ...knowledgeCounts, [agent._id]: knowledges?.length || 0 };
				}
			} catch (error) {
				console.error(`Error loading agent data:`, error);
			}
		}

		
	}

	async function handleAgentDetails(ev: MouseEvent, agent: AgentDataModel) {
		if (agent?._id) {
			await openAgentDetailsDialog(agent._id);
		}
	}
	function handleReady() {
		loadAgent();
	}
</script>

<AuthUserReady onReady={handleReady} />
<div class="w-full bg-white dark:bg-base-700 rounded-md shadow p-2 md:p-4 my-2 md:my-4">
	<div class="flex justify-between">
		<div class="flex gap-4 items-center">
			<div class="">
				<!-- <Icon path={mdiFaceAgent} /> -->
				<IconCircle iconPath={mdiFaceAgent} />
			</div>
			<div class="">
				<div class="my-0">
					<h2 class="font-bold text-lg">{agent?.name || ''}</h2>
				</div>
				<div class="text-sm text-base-400">{agent?.desc || ''}</div>
			</div>
		</div>
		<div>
			<Button
				iconPath={mdiInformationOutline}
				iconClassName="text-base-400 hover:text-base-800"
				onClick={(ev) => handleAgentDetails(ev, agent!)}
			/>
		</div>
	</div>
	<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6 ">
		<!--Agent's specifications Card-->
		<div class="bg-base-50 dark:bg-base-600 text-base-800 dark:text-base-300 p-4 md:p-6 rounded">
			<div class="flex justify-center">
				<IconCircle
					iconPath={mdiFaceAgent}
					circleClassName={appState.theme == 'light' ? '!bg-base-200' : 'dark:bg-base-500'}
					iconClassName="{appState.theme == 'light'
						? '!text-base-500'
						: '!dark:text-base-300'}  "
				/>
			</div>
			<div>
				<div class="mt-4 text-base-500 dark:text-base-300 text-sm text-center">
					Agent Language
				</div>
				<div class=" font-bold text-base dark:text-base-300 text-center">
					{agent?.lang || 'No Language!'}
				</div>
			</div>
			<div>
				<div class="mt-4 text-base-500 dark:text-base-300 text-sm text-center">
					Agent Gender
				</div>
				<div class=" font-bold text-base dark:text-base-300 text-center">
					{agent?.gender || 'No Gender!'}
				</div>
			</div>
		</div>
		<!--Agent Call-Pricing Card-->
		<div class="bg-base-50 dark:bg-base-600 p-4 md:p-6 rounded">
			<div class="flex justify-center">
				<IconCircle
					iconPath={mdiPhone}
					circleClassName={appState.theme == 'light' ? '!bg-base-200' : 'dark:bg-base-500'}
					iconClassName="{appState.theme == 'light'
						? '!text-base-500'
						: '!dark:text-base-300'}  "
				/>
			</div>
			<div>
				<div class="mt-4 text-base-500 dark:text-base-300 text-sm text-center">
					Call Price/min
				</div>
				<div class=" font-bold text-base ark:text-base-300 text-center">$1</div>
			</div>
		</div>
		<!--Agent Knowlwdge Card-->
		<div class="bg-base-50 dark:bg-base-600 p-4 md:p-6 rounded">
			<div class="flex justify-center">
				<IconCircle
					iconPath={mdiFaceAgent}
					circleClassName={appState.theme == 'light' ? '!bg-base-200' : 'dark:bg-base-500'}
					iconClassName="{appState.theme == 'light'
						? '!text-base-500'
						: '!dark:text-base-300'}  "
				/>
			</div>
			<div>
				<div class="mt-4 text-base-500 dark:text-base-300 text-sm text-center">
					Agent Knowledge
				</div>
				<div class=" font-bold text-base dark:text-base-300 text-center">
					{knowledgeCounts[agent?._id!] || 0}
				</div>
			</div>
		</div>
	</div>
</div>
