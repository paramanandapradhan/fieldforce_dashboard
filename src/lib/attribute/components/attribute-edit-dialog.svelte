<script lang="ts">
	import { ColorField, TextField, type DialogExports } from '@cloudparker/moldex.js';
	import type { AttributeDataModel } from '../attribute-types';
	import {
		AttributeTypeEnum,
		createAttribute,
		getAttribute,
		syncAttributes,
		updateAttribute
	} from '../attribute-service';

	type Props = {
		parent?: string;
		attributeType: AttributeTypeEnum;
		attribute?: AttributeDataModel;
		nameLabel?: string;
		hasColor?: string;
	};

	let {
		parent,
		attributeType,
		attribute,
		nameLabel = 'Attribute Name',
		closeDialog,
		setOkEnabled,
		setOkSpinner,
		hasColor,
		setResult
	}: DialogExports & Props = $props();

	let name: string = $state(attribute?.name || '');
	let desc: string = $state(attribute?.desc || '');
	let color: string = $state(attribute?.color || '');

	async function handleSubmit(ev: SubmitEvent) {
		ev.preventDefault();
		name = (name || '').trim();
		desc = (desc || '').trim();
		color = (color || '').trim();
		if (name && attributeType) {
			try {
				setOkEnabled(false);
				setOkSpinner(true);
				let payload: AttributeDataModel = { name, desc, color, type: attributeType };
				if (parent) {
					payload.parent = parent;
				}
				let id = null;
				if (attribute?._id) {
					id = await updateAttribute(attribute?._id, payload);
				} else {
					id = await createAttribute(payload);
				}
				if (id) {
					await syncAttributes();
					let attr = await getAttribute(id);
					closeDialog(attr);
				}
			} catch (error) {
				console.log(error);
			} finally {
				setOkEnabled(true);
				setOkSpinner(false);
			}
		}
	}
</script>

<form id="attribute-edit-form" onsubmit={handleSubmit}>
	<div class="px-6">
		<div class="my-4">
			<TextField
				name="name"
				maxlength={100}
				label={nameLabel}
				bind:value={name}
				required
				autofocus
			/>
		</div>
		<div class="my-4">
			<TextField name="desc" maxlength={200} label="Description" bind:value={desc} />
		</div>
		<div class="my-4">
			<ColorField name="color" label="Color" bind:value={color} />
		</div>
	</div>
</form>
