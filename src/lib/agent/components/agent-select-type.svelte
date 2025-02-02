<script lang="ts">
	import { page } from '$app/stores';
	import { Button, showToast, TextareaField } from '@cloudparker/moldex.js';
	import { getAgent, syncAgents, updateAgent } from '../services/agent-service';
	import AgentGenderComboboxField from './agent-gender-combobox-field.svelte';
	import AgentVoiceComboboxField from './agent-voice-combobox-field.svelte';
	import AgentLanguageComboboxField from './agent-language-combobox-field.svelte';
	import AuthUserReady from '$lib/auth/components/auth-user-ready.svelte';

	let lang: string = $state('');
	let gender: string = $state('');
	let voice: string = $state('');

	let agentId: string | null = $derived($page.url.searchParams.get('agentId'));

	async function loadAgentSpecificactions() {
		if (agentId) {
			try {
				const agent = await getAgent(agentId);
				if (agent) {
					lang = agent.lang || '';
					gender = agent.gender || '';
					voice = agent.voice || '';
				}
			} catch (error) {
				console.error('Error loading agent specifications:', error);
				showToast({ msg: 'Error loading agent specifications.' });
			}
		}
	}
	async function handleSubmit(ev: SubmitEvent) {
		ev.preventDefault();
		try {
			let payload = { lang, gender, voice };
			let id = null;
			if (agentId) {
				id = await updateAgent(agentId, payload);
			}
			if (id) {
				await syncAgents();
				let res = await getAgent(id);
			}
			showToast({ msg: 'Agent specifications saved successfully!' });
		} catch (error) {
			console.error('Error saving agent:', error);
		}
	}

	async function handleReady() {
		await loadAgentSpecificactions();
	}
</script>

<AuthUserReady onReady={handleReady} />
<div class="min-h-full">
	<form action="" onsubmit={handleSubmit}>
		<div
			class="bg-white dark:bg-base-700 shadow px-6 py-6 items-center rounded-lg justify-center order-2 sm:order-1"
		>
			<div>
				<h1 class="font-bold text-xl text-base-800 dark:text-base-300">
					Configure your agent's specifications.
				</h1>
			</div>
			<div class="my-4">
				<AgentLanguageComboboxField name="lang" label="Voice Language" bind:value={lang} />
			</div>
			<div class="my-4">
				<AgentGenderComboboxField name="gender" label="Voice Gender" bind:value={gender} />
			</div>
			<div class="my-4">
				<AgentVoiceComboboxField name="voice" label="Voice Type" bind:value={voice} />
			</div>

			<div class="my-4 py-4 flex justify-end gap-4 me-4">
				<Button
					appearance="primary"
					label="Save"
					type="submit"
					disabled={!(lang && gender && voice)}
				/>
			</div>
		</div>
	</form>
</div>
