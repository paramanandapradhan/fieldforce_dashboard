<script lang="ts">
	import { TextField, type DialogExports } from '@cloudparker/moldex.js';
	import type { AgentDataModel } from '../types/agent-types';
	import { createAgent, getAgent, syncAgents, updateAgent } from '../services/agent-service';
	import LanguageComboboxField from './agent-language-combobox-field.svelte';
	import LanguageGenderComboboxField from './agent-gender-combobox-field.svelte';
	import LanguageVoiceComboboxField from './agent-voice-combobox-field.svelte';

	type Props = {
		agent?: AgentDataModel;
	};

	let { agent, closeDialog, setResult, setOkSpinner, setOkEnabled }: Props & DialogExports =
		$props();

	let name: string = $state(agent?.name || '');
	let desc: string = $state(agent?.desc || '');
	let lang: string = $state(agent?.lang || 'English');
	let gender: string = $state(agent?.gender || 'Male');
	// let voice: string = $state(agent?.voice || '');

	async function handleSubmit(ev: SubmitEvent) {
		ev.preventDefault();

		name = (name || '').trim();
		desc = (desc || '').trim();

		if (name) {
			try {
				setOkSpinner(true);
				setOkEnabled(false);
				let id = null;
				let payload = { name, desc,lang,gender };
				if (agent?._id) {
					id = await updateAgent(agent?._id, payload);
				} else {
					id = await createAgent(payload);
				}
				if (id) {
					await syncAgents();
					let res = await getAgent(id);
					closeDialog(res);
				}
			} catch (error) {
				console.error(error);
			} finally {
				setOkSpinner(false);
				setOkEnabled(true);
			}
		}
	}
</script>

<form id="agent-edit-form" onsubmit={handleSubmit}>
	<div class="px-6 min-h-[400px]">
		<div class="my-4">
			<TextField
				name="name"
				label="Agent Name"
				required
				maxlength={25}
				autofocus
				bind:value={name}
			/>
		</div>

		<div class="my-4">
			<TextField name="desc" label="Agent Description" maxlength={50} bind:value={desc} />
		</div>
		<div class="my-4">
			<LanguageComboboxField name="lang" label="Voice Language" bind:value={lang} required />
		</div>
		<div class="my-4">
			<LanguageGenderComboboxField name="gender" label="Voice Gender" bind:value={gender} required/>
		</div>
		<!-- <div class="my-4">
			<LanguageVoiceComboboxField name="voice" label="Voice Type" bind:value={voice} />
		</div> -->
	</div>
</form>
