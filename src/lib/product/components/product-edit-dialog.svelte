<script lang="ts">
	import { createProduct, getProduct, syncProducts, updateProduct } from '../product-service';
	import type { ProductDataModel } from '../product-type';
	import { NumberField, showToast, TextField, type DialogExports } from '@cloudparker/moldex.js';

	type Props = {
		product?: ProductDataModel;
	};

	let { product, closeDialog, setResult, setOkEnabled, setOkSpinner }: Props & DialogExports =
		$props();

	let name = $state(product?.name || '');
	let desc = $state(product?.desc || '');
	let mrp = $state(product?.mrp);
	let salesPrice = $state(product?.salesPrice);

	async function handleSubmit(ev: SubmitEvent) {
		ev.preventDefault();
		name = (name || '').trim();
		desc = (desc || '').trim();
		mrp = mrp;
		salesPrice = salesPrice;

		if (name) {
			setOkEnabled(false);
			setOkSpinner(true);
			let payload = {
				name,
				desc,
				mrp,
				salesPrice
			};
			let id = null;
			if (!product?._id) {
				id = await createProduct(payload);
			} else {
                id = await updateProduct(product?._id, payload)
            }
            if(id){
                await syncProducts();
                let product = getProduct(id)
                setResult(product)
            }
            closeDialog()
		}else{
            showToast({ msg: 'Please fill the required fields' });
        }
	}
</script>

<form id="product-edit-form" onsubmit={handleSubmit}>
    <div class="px-6">
        <div class="my-4">
            <TextField
				name="Product name"
				label="Product name"
				maxlength={80}
				bind:value={name}
				required
				autofocus
			/>
        </div>
        <div class="my-4">
			<TextField name="desc" label="Description" maxlength={100} bind:value={desc} />
		</div>
        <div class="my-4">
            <NumberField name="mrp" label="MRP" bind:value={mrp}/>
        </div>
        <div class="my-4">
            <NumberField name="sales price" label="Sales Price" bind:value={salesPrice}/>
        </div>
    </div>
</form>
