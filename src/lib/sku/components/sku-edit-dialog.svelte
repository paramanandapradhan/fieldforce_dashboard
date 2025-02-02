<script lang="ts">
	import { DateField, NumberField, TextField, type DialogExports } from '@cloudparker/moldex.js';
	import type { SkuDataModel } from '../sku-types';
	import { createSku, updateSku } from '../sku-service';

	type Props = {
		sku: SkuDataModel;
	};

	let { sku, closeDialog, setOkEnabled, setOkSpinner }: DialogExports & Props = $props();

	let name = $state(sku?.name || '');
	let desc = $state(sku?.desc || '');
	let price = $state(sku?.price || 0);
	let dis = $state(sku?.dis || 0);
	let deat = $state(sku?.deat || new Date());

	async function handleSubmit(ev: Event) {
		ev.preventDefault();

		name = (name || '').trim();
		desc = (desc || '').trim();
		price = price || 0;
		if (price != null && name) {
			let res: SkuDataModel | null = null;
			setOkEnabled(false);
			setOkSpinner(true);
			let payload: SkuDataModel = {
				name,
				desc,
				price,
				dis,
				deat
			};
			try {
				if (sku?._id) {
					res = await updateSku(sku?._id, payload);
				} else {
					res = await createSku(payload);
				}
			} catch (error) {
				console.error(error);
			} finally {
				setOkEnabled(true);
				setOkSpinner(false);
			}

			await closeDialog(res);
		}
	}
</script>

<form id="sku-edit-form" onsubmit={handleSubmit}>
	<div class="px-6">
		<div class="my-4">
			<TextField name="name" label="SKU name" maxlength={80} autofocus required bind:value={name} />
		</div>

		<div class="my-4">
			<TextField name="desc" label="Description" maxlength={500} bind:value={desc} />
		</div>

		<div class="my-4">
			<NumberField name="price" label="Price" bind:value={price} step={0.01} />
		</div>
		<div class="my-4">
			<NumberField name="dis" label="Discount" bind:value={dis} />
		</div>

		<div class="my-4">
			<DateField name="deat" label="Discount End Date" bind:value={deat} />
		</div>
	</div>
</form>
