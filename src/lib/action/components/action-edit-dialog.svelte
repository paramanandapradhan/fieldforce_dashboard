<script lang="ts">
	import AttributeComboboxField from '$lib/attribute/components/attribute-combobox-field.svelte';
	import { showToast, TextareaField, TextField, type DialogExports } from '@cloudparker/moldex.js';
	import type { ActionDataModel } from '../action-types';
	import { createAction, getAction, syncActions, updateAction } from '../action-service';
	import { AttributeTypeEnum } from '$lib/attribute/attribute-service';

	type Props = {
		action?: ActionDataModel;
		agentId: string;
	};

	let {
		action,
		agentId,
		closeDialog,
		setResult,
		setOkEnabled,
		setOkSpinner
	}: Props & DialogExports = $props();

	let name = $state(action?.name || '');
	let desc = $state(action?.desc || '');
	let maxLength = $state(500);
	let remainingCharacters: number = $state(0);

	async function handleSubmit(ev: SubmitEvent) {
		ev.preventDefault();
		name = (name || '').trim();
		desc = (desc || '').trim();

		if (name && desc && agentId) {
			setOkEnabled(false);
			setOkSpinner(true);
			let paylod = { name, desc, agent: agentId };
			let id = null;
			if (!action?._id) {
				id = await createAction(paylod);
			} else {
				id = await updateAction(action?._id, paylod);
			}
			if (id) {
				await syncActions();
				let action = getAction(id);
				setResult(action);
			}
			closeDialog();
		} else {
			showToast({ msg: 'Please fill the required fields' });
		}
	}

    $effect(() => {
		remainingCharacters = maxLength - (desc.length || 0);

	})
</script>

<form id="action-edit-form" onsubmit={handleSubmit}>
	<div class="px-6">
		<div class="my-4">
			<TextField
				name="name"
				label="Action Name"
				required
				maxlength={50}
				autofocus
				bind:value={name}
			/>
		</div>
		<div class="my-4">
			<TextareaField
				name="desc"
				label="Action Description"
				maxlength={maxLength}
				bind:value={desc}
				required
				rows={10}
			/>
            <p class="text-end text-base-400">{remainingCharacters} Character(s) left</p>
		</div>
	</div>
</form>
