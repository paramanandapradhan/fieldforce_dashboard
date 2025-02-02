<script lang="ts">
	import { Button, showToast, TextareaField } from '@cloudparker/moldex.js';
	import { page } from '$app/stores';
	import { getAgent, syncAgents, updateAgent } from '../services/agent-service';
	import AuthUserReady from '$lib/auth/components/auth-user-ready.svelte';

	let knowledge: string = $state('');
	let originalKnowledge: string = $state(''); // To track the original value
	let editMode: boolean = $state(false); // To toggle between edit and view modes
	let isEditEnabled: boolean = $state(false); // Disable the edit button initially
	let isTextAreaDisabled: boolean = $state(false); // To control text area read-only state

	let agentId: string | null = $derived($page.url.searchParams.get('agentId'));

	// Handle form submission
	async function handleSubmit(ev: SubmitEvent) {
		ev.preventDefault();
		knowledge = knowledge.trim();
		try {
			let payload = { knowledge };
			let id = null;
			if (agentId) {
				id = await updateAgent(agentId, payload);
			}
			if (id) {
				await syncAgents();
				let res = await getAgent(id);
			}
			showToast({ msg: 'Agent Basic knowledge saved successfully!' });

			// Enable edit button after save
			isEditEnabled = true;
			originalKnowledge = knowledge; // Update original value
			editMode = false;
			isTextAreaDisabled = true; // Disable text area again after save
		} catch (error) {
			console.error('Error saving agent:', error);
		}
	}

	// Load knowledge when the page is initialized
	async function loadAgentKnowledge() {
		if (agentId) {
			try {
				const agent = await getAgent(agentId);
				if (agent && agent.knowledge) {
					knowledge = agent.knowledge;
					originalKnowledge = agent.knowledge;
					isEditEnabled = true; // Enable the Edit button after loading
					isTextAreaDisabled = true; // Make the text area read-only initially
				}
			} catch (error) {
				console.error('Error loading agent knowledge:', error);
				showToast({ msg: 'Error loading agent knowledge.' });
			}
		}
	}

	async function handleEdit() {
		editMode = true;
		isTextAreaDisabled = false; // Enable text area for editing
	}

	function handleCancel() {
		knowledge = originalKnowledge; // Revert to original value
		editMode = false;
		isTextAreaDisabled = true; // Make the text area read-only again
	}
	async function handleReady() {
		await loadAgentKnowledge();
	}
</script>

<AuthUserReady onReady={handleReady} />
<div class="min-h-full">
	<form action="" onsubmit={handleSubmit}>
		<div class=" bg-white dark:bg-base-700 shadow-lg rounded-lg text-base-800 dark:text-base-300">
			<div class="py-6 px-6">
				<TextareaField
					label="Basic Agent Knowledge"
					placeholder="Enter knowledge about your agent"
					maxlength={1000}
					bind:value={knowledge}
					disabled={isTextAreaDisabled}
				/>
			</div>
			<div class="my-4 py-4 flex justify-end gap-4 me-4">
				<Button
					appearance="primary"
					label="Save"
					type="submit"
					disabled={!knowledge || isTextAreaDisabled}
				/>
				{#if isEditEnabled}
					<Button appearance="primary" label="Edit" onClick={handleEdit} />
				{/if}
				{#if editMode}
					<Button appearance="primary" label="Cancel" onClick={handleCancel} />
				{/if}
			</div>
		</div>
	</form>
</div>
