<script lang="ts">
	import {
		Button,
		ButtonListItem,
		ButtonMenu,
		Icon,
		IconCircle,
		mdiPhone,
		navigate,
		openDeleteConfirmDialog,
		openNumberFieldDialog,
		openTextFieldDialog
	} from '@cloudparker/moldex.js';

	import {
		mdiDotsHorizontal,
		mdiFaceAgent,
		mdiInformationOutline
	} from '$lib/core/services/app-icons-service';
	import { getAllAgents, syncAgents, updateAgent } from '../services/agent-service';
	import type { AgentDataModel } from '../types/agent-types';
	import {
		openAgentDeleteDialog,
		openAgentDetailsDialog,
		openAgentEditDialog
	} from '../services/agent-ui-service';
	import { onMount } from 'svelte';
	import { getAllKnowledges } from '$lib/knowledge/knowledge-service';
	import { appState } from '$lib/core/services/app-state.svelte';

	let agents: AgentDataModel[] = $state([]);
	let knowledgeCounts: Record<string, number> = $state({});

	export async function loadAgents() {
		agents = (await getAllAgents()) || [];

		const counts: Record<string, number> = {};
		// Fetch knowledge count for each agent
		await Promise.all(
			agents.map(async (agent) => {
				try {
					// Fetch knowledge list for this agent
					const knowledges = await getAllKnowledges({ agent: agent._id });
					counts[agent._id!] = knowledges.length;
				} catch (error) {
					console.error(`Error fetching knowledge for agent ${agent._id}:`, error);
				}
			})
		);
		knowledgeCounts = { ...counts };
		// console.log('Agents loaded:', agents);
		// console.log('Knowledge counts:', knowledgeCounts);
	}

	async function handleMenu(ev: MouseEvent, menu: string, agent: AgentDataModel) {
		switch (menu) {
			case 'Edit':
				await openAgentEditDialog(agent);
				await loadAgents();
				break;
			case 'Delete':
				await openAgentDeleteDialog(agent);
				await loadAgents();
				break;
			case 'Call Price':
				editCallPrice(agent);
				break;
			case 'Chat Price':
				editChatPrice(agent);
				break;
		}
	}

	async function editCallPrice(agent: AgentDataModel) {
		let callPrice: number = (await openNumberFieldDialog({
			title: 'Call Pricing',
			label: 'Call Pricing',
			value: agent.callPrice || 0
		})) as number;
		if (callPrice != null && agent._id) {
			await updateAgent(agent._id, { callPrice });
			await syncAgents();
			await loadAgents();
		}
	}

	async function editChatPrice(agent: AgentDataModel) {
		let chatPrice: number = (await openNumberFieldDialog({
			title: 'Call Pricing',
			label: 'Call Pricing',
			value: agent.callPrice || 0
		})) as number;
		if (chatPrice != null && agent._id) {
			await updateAgent(agent._id, { chatPrice });
			await syncAgents();
			await loadAgents();
		}
	}

	async function handleAgentDetails(ev: MouseEvent, agent: AgentDataModel) {
		if (agent?._id) {
			await openAgentDetailsDialog(agent._id);
		}
	}

	function handleManageAgent(agent: AgentDataModel){
		navigate(`/restricted/agents/view?agentId=${agent._id}`)
	}

	onMount(() => {
		loadAgents();
	});
</script>

<div>
	{#each agents as agent, index}
		<div
			class="w-full bg-white dark:bg-base-700 text-base-800 dark:text-base-300 shadow-sm rounded-xl p-2 md:p-4 my-2 md:my-4"
		>
			<!-- Agent Deatails -->
			<div class="flex gap-4">
				<div>
					<IconCircle iconPath={mdiFaceAgent} />
				</div>
				<div class="flex-grow">
					<div class="font-bold hover:text-primary-500">
						<a href="/restricted/agents/view?agentId={agent._id}">
							{agent.name || ''}
						</a>
					</div>
					<div class="text-sm text-base-400">{agent.desc || ''}</div>
				</div>
				<div class="flex gap-0">
					<div>
						<Button
							iconPath={mdiInformationOutline}
							iconClassName="text-base-400 hover:text-base-800"
							onClick={(ev) => handleAgentDetails(ev, agent!)}
						/>
					</div>
					<div>
						<ButtonMenu
							menus={['Edit', 'Delete', 'Call Price', 'Chat Price']}
							iconPath={mdiDotsHorizontal}
							iconClassName="text-base-400 hover:text-base-800"
							onMenu={(ev, menu) => handleMenu(ev, menu as string, agent)}
						/>
					</div>
				</div>
			</div>
			<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6 ">
				<!--Agent's specifications Card-->
				<div
					class="bg-base-50 dark:bg-base-600 text-base-800 dark:text-base-300 p-4 md:p-6 rounded"
				>
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
							{agent.lang || 'No Language!'}
						</div>
					</div>
					<div>
						<div class="mt-4 text-base-500 dark:text-base-300 text-sm text-center">
							Agent Gender
						</div>
						<div class=" font-bold text-base dark:text-base-300 text-center">
							{agent.gender || 'No Gender!'}
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
							{knowledgeCounts[agent._id!] || 0}
						</div>
					</div>
				</div>
			</div>
			<div class="my-4 flex justify-end">
				<Button appearance="border-base" label="Manage Agent" onClick={() => handleManageAgent(agent)} className="w-full md:w-auto"/>
			</div>
		</div>
	{/each}
</div>
