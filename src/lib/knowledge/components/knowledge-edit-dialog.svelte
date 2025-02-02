<script lang="ts">
	import { showToast, TextareaField, type DialogExports } from '@cloudparker/moldex.js';
	import {
		createKnowledge,
		getKnowledge,
		syncKnowledges,
		updateKnowledge
	} from '../knowledge-service';
	import { type KnowledgeDataModel } from '../knowledge-types';
	import AttributeComboboxField from '$lib/attribute/components/attribute-combobox-field.svelte';
	import { AttributeTypeEnum } from '$lib/attribute/attribute-service';

	type Props = {
		knowledge?: KnowledgeDataModel;
		agentId: string;
	};

	let {
		knowledge,
		agentId,
		closeDialog,
		setResult,
		setOkEnabled,
		setOkSpinner
	}: Props & DialogExports = $props();

	let topic = $state(knowledge?.topic || '');
	let text = $state(knowledge?.text || '');
	let maxLength = $state(2000);
	let remainingCharacters: number = $state(0);

	async function handleSubmit(ev: SubmitEvent) {
		ev.preventDefault();
		text = text
			.split('\n') // Split by line breaks
			.map((line) => line.trim()) // Trim each line
			.filter((line) => line !== '') // Remove empty lines
			.join('\n');

		if (text && topic && agentId) {
			setOkEnabled(false);
			setOkSpinner(true);
			let payload = { topic, text, agent: agentId };
			let id = null;
			if (!knowledge?._id) {
				id = await createKnowledge(payload);
			} else {
				id = await updateKnowledge(knowledge?._id, payload);
			}
			if (id) {
				await syncKnowledges();
				let knowledge = getKnowledge(id);
				setResult(knowledge);
			}
			closeDialog();
		} else {
			showToast({ msg: 'Please fill the required fields' });
		}
	}

	$effect(() => {
		remainingCharacters = maxLength - (text.length || 0);
	});
</script>

<form id="knowledge-edit-form" onsubmit={handleSubmit}>
	<div class="px-6">
		<div class="my-4">
			<AttributeComboboxField
				attributeType={AttributeTypeEnum.KNOWLEDGE_TOPIC}
				parent={agentId}
				label="Topic"
				required
				autofocus
				bind:value={topic}
			/>
		</div>
		<div class="my-4">
			<TextareaField
				name="name"
				label="Knowlege"
				maxlength={maxLength}
				bind:value={text}
				rows={10}
				required
			/>
			<p class="text-end text-base-400">{remainingCharacters} Character(s) left</p>
		</div>
	</div>
</form>
