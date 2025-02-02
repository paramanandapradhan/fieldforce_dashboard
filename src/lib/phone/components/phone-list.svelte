<script lang="ts">
	import { getAllAgents } from '$lib/agent/services/agent-service';
	import type { AgentDataModel } from '$lib/agent/types/agent-types';
	import AuthUserReady from '$lib/auth/components/auth-user-ready.svelte';
	import {
		Button,
		ButtonListItem,
		ButtonMenu,
		IconCircle,
		mdiPhone,
		navigate,
		openLoadingDialog
	} from '@cloudparker/moldex.js';
	import { getAllPhones, syncPhones, updatePhone } from '../phone-service';
	import type { PhoneDataModel } from '../phone-types';
	import {
		openAgentPickerDialog,
		openPhoneDeleteDialog,
		openPhoneEditDialog
	} from '../phone-ui-service';
	import { mdiCashSync, mdiFaceAgent } from '$lib/core/services/app-icons-service';
	import TextAgent from '$lib/agent/components/text-agent.svelte';
	import { appState } from '$lib/core/services/app-state.svelte';

	let isReady = $state(false);
	let phones: PhoneDataModel[] = $state([]);
	let agents: AgentDataModel[] = $state([]);

	export async function loadPhones() {
		phones = await getAllPhones();
	}

	function handleMenu(ev: Event, menu: string, phone: PhoneDataModel) {
		switch (menu) {
			// case 'Edit':
			// 	editPhone(phone);
			// 	break;
			case 'Delete':
				deletePhone(phone);
				break;
		}
	}

	async function editPhone(phone: PhoneDataModel) {
		let res = await openPhoneEditDialog(phone);
		if (res) {
			loadPhones();
		}
	}

	async function deletePhone(phone: PhoneDataModel) {
		let res = await openPhoneDeleteDialog(phone);
		if (res) {
			loadPhones();
		}
	}

	async function handleSelectAgent(ev: Event, phone: PhoneDataModel) {
		if (phone?._id) {
			agents = await getAllAgents();
			let res: string = await openAgentPickerDialog({
				agents
			});
			if (res) {
				let loading = await openLoadingDialog();
				try {
					await updatePhone(phone._id, { agent: res });
					await syncPhones();
					await loadPhones();
				} catch (error) {
					console.error(error);
				} finally {
					loading.closeDialog();
				}
			}
		}
	}

	function handleManagePhone(phone: PhoneDataModel){
		navigate(`restricted/phones/view?phonId=${phone._id}`)
	}

	function handleReady() {
		loadPhones();
	}
</script>

<AuthUserReady onReady={handleReady} />
<div>
	{#each phones as phone}
		<div
			class="bg-white dark:bg-base-700 text-base-800 dark:text-base-300 shadow-sm rounded-xl p-4 my-4"
		>
			<div class="flex gap-4 items-center justify-between">
				<div class="shrink-0">
					<IconCircle iconPath={mdiPhone} />
				</div>
				<div class="flex-grow flex items-center min-w-0">
					<a href="/restricted/phones/view?phonId={phone._id}">
						<div class="font-bold items-center">
							<span class="hover:text-primary-600">{phone?.number || ''}</span>
							<span class="text-base-400">
								({phone?.type == 'local' ? 'Local' : 'TollFree'} Number)
							</span>
						</div>
					</a>
					<!-- <div class="text-sm text-base dark:text-base-300">
						{phone?.desc || ''}
					</div> -->
				</div>
				<div class="flex gap-2">
					<ButtonMenu
						iconClassName="text-base-400 hover:text-base-800"
						menus={['Delete']}
						onMenu={(ev, menu) => handleMenu(ev, menu as string, phone)}
					/>
				</div>
			</div>

			<div class="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
				<!-- Agent-card -->
				<div class="bg-base-50 dark:bg-base-600 tex-base-800 dark:text-base-300 p-6 rounded">
					<div class="flex justify-center">
						<IconCircle
							iconPath={mdiFaceAgent}
							circleClassName={appState.theme == 'light' ? '!bg-base-200' : 'dark:bg-base-500'}
							iconClassName="{appState.theme == 'light'
								? '!text-base-500'
								: '!dark:text-base-300'}  "
						/>
					</div>

					<div class="mt-4 text-center">
						{#if phone?.agent}
							<div class="text-base-500 dark:text-base-300 text-sm">Selected Agent</div>
							<div class=" font-bold text-base dark:text-base-300">
								<a
									href="/restricted/agents/view?agentId={phone?.agent}"
									class="underline hover:text-primary"
								>
									<TextAgent input={phone?.agent} />
								</a>
							</div>
						{:else}
							<div class=" text-base-400 dark:text-base-300 text-sm">No Agent</div>
						{/if}
						<div class="mt-4 flex items-center justify-center">
							<Button
								appearance="border-base"
								size="sm"
								label={phone?.agent ? 'Change Agent' : 'Select Agent'}
								onClick={(ev) => handleSelectAgent(ev, phone)}
							/>
						</div>
					</div>
				</div>

				<!-- Monthly-rental -->
				<div class="bg-base-50 p-6 rounded dark:bg-base-600 tex-base-800 dark:text-base-300">
					<div class="flex justify-center">
						<IconCircle
							iconPath={mdiCashSync}
							circleClassName={appState.theme == 'light' ? '!bg-base-200' : 'dark:bg-base-500'}
							iconClassName="{appState.theme == 'light'
								? '!text-base-500'
								: '!dark:text-base-300'}  "
						/>
					</div>
					<div>
						<div class="mt-4 text-base-500 dark:text-base-300 text-sm text-center">
							Monthly Rental
						</div>
						<div class=" font-bold text-base dark:text-base-300 text-center">$6.00</div>
					</div>
				</div>

				<!-- Call-Pricing -->
				<div class="bg-base-50 dark:bg-base-600 tex-base-800 dark:text-base-300 p-6 rounded">
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
						<div class=" font-bold text-base dark:text-base-300 text-center">$0.01</div>
					</div>
				</div>
			</div>
			<div class="my-4 flex justify-end">
				<Button appearance="border-base" label="Manage Number" onClick={() => handleManagePhone(phone)} className="w-full md:w-auto"/>
			</div>
		</div>
	{/each}
</div>
