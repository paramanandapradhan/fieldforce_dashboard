<script lang="ts">
	import AuthUserReady from '$lib/auth/components/auth-user-ready.svelte';
	import { Button, IconCircle, mdiPhone } from '@cloudparker/moldex.js';
	import { getPhone } from '../phone-service';
	import type { PhoneDataModel } from '../phone-types';
	import { openPhoneDetailsDialog, openPhoneEditDialog } from '../phone-ui-service';
	import {
		mdiCashSync,
		mdiFaceAgent,
		mdiInformationOutline,
		mdiPencil
	} from '$lib/core/services/app-icons-service';
	import TextAgent from '$lib/agent/components/text-agent.svelte';
	import { appState } from '$lib/core/services/app-state.svelte';

	type Props = {
		phoneId: string;
	};

	let { phoneId }: Props = $props();

	let phone: PhoneDataModel | null = $state(null);

	let isReady = $state(false);

	// Load the agents according to its id
	export async function loadPhone() {
		if (phoneId) {
			phone = await getPhone(phoneId);
		}
	}

	// Update the agents according to its id
	async function handleEdit(ev: MouseEvent) {
		if (phoneId) {
			const res = await openPhoneEditDialog(phone!);
			if (res) {
				loadPhone();
			}
		}
	}

	async function handleItemClick(ev: MouseEvent, phone: PhoneDataModel) {
		if (phone?._id) {
			await openPhoneDetailsDialog(phone._id);
		}
	}
	function handleReady() {
		loadPhone();
	}
</script>

<AuthUserReady onReady={handleReady} />
<div class="bg-white dark:bg-base-700 rounded-md shadow py-4">
	<div class="flex gap-4 items-center">
		<!-- <Button className="w-full text-start" onClick={(ev) => handleItemClick(ev, phone!)}> -->
		<div class="ps-3">
			<IconCircle iconPath={mdiPhone} />
		</div>
		<div class="flex-grow flex items-center">
			<div class="font-bold">
				<span>{phone?.number || ''}</span>
				<span class="text-base-400">({phone?.type == 'local' ? 'Local' : 'TollFree'} Number)</span>
			</div>

			<!-- <div class="text-sm text-base dark:text-base-300">
				{phone?. || ''}
			</div> -->
		</div>
		<div class="flex gap-0">
			<div>
				<Button
					iconPath={mdiInformationOutline}
					iconClassName="text-base-400 hover:text-base-800"
					onClick={(ev) => handleItemClick(ev, phone!)}
				/>
			</div>
			<div>
				<Button iconPath={mdiPencil} iconClassName="text-base-400 hover:text-base-800" onClick={handleEdit} />
			</div>
		</div>
	</div>
	<div class="flex flex-col md:flex-row mt-6 ps-6 md:ps-16 gap-6 items-center md:items-start">
		<!-- Agent-card -->
		<div
			class="bg-base-50 dark:bg-base-600 tex-base-800 dark:text-base-300 p-6 rounded w-full md:w-auto"
		>
			<div class="flex justify-center">
				<IconCircle
					iconPath={mdiFaceAgent}
					circleClassName={appState.theme == 'light' ? '!bg-base-200' : 'dark:bg-base-500'}
					iconClassName="{appState.theme == 'light' ? '!text-base-500' : '!dark:text-base-300'}  "
				/>
			</div>

			<div class="text-center">
				{#if phone?.agent}
					<div class="mt-4 text-base-500 dark:text-base-300 text-sm text-center">
						Selected Agent
					</div>
					<div class=" font-bold text-base dark:text-base-300 text-center">
						<a
							href="/restricted/agents/view?agentId={phone?.agent}"
							class="underline hover:text-primary"
						>
							<TextAgent input={phone?.agent} />
						</a>
					</div>
				{:else}
					<div class="mt-4 text-base-400 dark:text-base-300 text-sm text-center">No Agent</div>
				{/if}
			</div>
		</div>

		<!-- Monthly-rental -->
		<div
			class="bg-base-50 p-6 rounded dark:bg-base-600 tex-base-800 dark:text-base-300 w-full md:w-auto"
		>
			<div class="flex justify-center">
				<IconCircle
					iconPath={mdiCashSync}
					circleClassName={appState.theme == 'light' ? '!bg-base-200' : 'dark:bg-base-500'}
					iconClassName="{appState.theme == 'light' ? '!text-base-500' : '!dark:text-base-300'}  "
				/>
			</div>
			<div class="text-center">
				<div class="mt-4 text-base-500 dark:text-base-300 text-sm text-center">Monthly Rental</div>
				<div class=" font-bold text-base dark:text-base-300 text-center">$6.00</div>
			</div>
		</div>

		<!-- Call-Pricing -->
		<div
			class="bg-base-50 dark:bg-base-600 tex-base-800 dark:text-base-300 p-6 rounded w-full md:w-auto"
		>
			<div class="flex justify-center">
				<IconCircle
					iconPath={mdiPhone}
					circleClassName={appState.theme == 'light' ? '!bg-base-200' : 'dark:bg-base-500'}
					iconClassName="{appState.theme == 'light' ? '!text-base-500' : '!dark:text-base-300'}  "
				/>
			</div>
			<div class="text-center">
				<div class="mt-4 text-base-500 dark:text-base-300 text-sm text-center">Call Price/min</div>
				<div class=" font-bold text-base dark:text-base-300 text-center">$0.01</div>
			</div>
		</div>
	</div>
</div>
