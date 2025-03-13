<script lang="ts">
	import { AttributeTypeEnum } from '$lib/attribute/attribute-service';
	import AttributeComboboxField from '$lib/attribute/components/attribute-combobox-field.svelte';
	import CustomerComboboxField from '$lib/user/components/customer-combobox-field.svelte';
	import { UserSubtypeEnum, UserTypeEnum } from '$lib/user/user-service';
	import { createProduct, getProduct, syncProducts, updateProduct } from '../product-service';
	import type { ProductDataModel } from '../product-type';
	import {
		NumberField,
		showToast,
		TextareaField,
		TextField,
		type DialogExports
	} from '@cloudparker/moldex.js';

	type Props = {
		product?: ProductDataModel;
	};

	let { product, closeDialog, setResult, setOkEnabled, setOkSpinner }: Props & DialogExports =
		$props();

	let name = $state(product?.name || '');
	let desc = $state(product?.desc || '');
	let mrp = $state(product?.mrp);
	let salePrice = $state(product?.salePrice);
	let type = $state(product?.type || '');
	let umo = $state(product?.umo || '');
	let categories = $state(product?.categories || '');
	let brand = $state(product?.brand || '');
	let batch = $state(product?.batch || '');
	let note = $state(product?.note || '');
	let seller = $state(product?.seller || '');

	async function handleSubmit(ev: SubmitEvent) {
		ev.preventDefault();
		name = (name || '').trim();
		desc = (desc || '').trim();
		mrp = mrp;
		salePrice = salePrice;
		type = (type || '').trim();
		umo = (umo || '').trim();
		categories = (categories || '').trim();
		brand = (brand || '').trim();
		batch = (batch || '').trim();
		note = (note || '').trim();
		seller = (seller || '').trim();

		if (name) {
			setOkEnabled(false);
			setOkSpinner(true);
			let payload = {
				name,
				desc,
				mrp,
				salePrice,
				type,
				umo,
				categories,
				brand,
				batch,
				note,
				seller
			};
			let id = null;
			if (!product?._id) {
				id = await createProduct(payload);
			} else {
				id = await updateProduct(product?._id, payload);
			}
			if (id) {
				await syncProducts();
				let product = getProduct(id);
				setResult(product);
			}
			closeDialog();
		} else {
			showToast({ msg: 'Please fill the required fields' });
		}
	}
</script>

<form id="product-edit-form" onsubmit={handleSubmit}>
	<div class="px-6 grid grid-cols-1 md:grid-cols-3 gap-4">
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
			<TextareaField name="desc" label="Description" maxlength={100} bind:value={desc} />
		</div>
		<div class="my-4">
			<NumberField name="mrp" label="MRP" bind:value={mrp} required />
		</div>
		<div class="my-4">
			<NumberField name="sales price" label="Sales Price" bind:value={salePrice} required />
		</div>
		<div class="my-4">
			<AttributeComboboxField
				attributeType={AttributeTypeEnum.TYPE}
				name="type"
				label="Type"
				bind:value={type}
				createButtonLabel="Add Product Type"
			/>
		</div>
		<div class="my-4">
			<AttributeComboboxField
				attributeType={AttributeTypeEnum.UMO}
				name="umo"
				label="Unit of Masurment"
				bind:value={umo}
				createButtonLabel="Add UMO"
			/>
		</div>
		<div class="my-4">
			<AttributeComboboxField
				attributeType={AttributeTypeEnum.CATEGORIES}
				name="categories"
				label="Categories"
				bind:value={categories}
				createButtonLabel="Add Categories"
				multiple
			/>
		</div>
		<div class="my-4">
			<AttributeComboboxField
				attributeType={AttributeTypeEnum.BRAND}
				name="brand"
				label="Brand"
				bind:value={brand}
				createButtonLabel="Add Brand"
			/>
		</div>
		<div class="my-4">
			<TextField name="batch" label="Batch" maxlength={200} bind:value={batch} />
		</div>
		<div class="my-4">
			<TextareaField name="note" label="Note" maxlength={500} bind:value={note} />
		</div>
		<div class="my-4">
			<CustomerComboboxField
				userType={UserTypeEnum.USER_TYPE_CUSTOMER}
				userSubtype={UserSubtypeEnum.USER_SUBTYPE_USER_DISTRIBUTOR}
				name="seller"
				label="Seller"
				bind:value={seller}
				required
			/>
		</div>
	</div>
</form>
