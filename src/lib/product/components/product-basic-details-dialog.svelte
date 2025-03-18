<script lang="ts">
	import { Spinner, TextCurrency, TextDate } from '@cloudparker/moldex.js';
	import BaseDataModelDetails from '$lib/core/components/base-data-model-details.svelte';
	
	import TextUser from '$lib/user/components/text-user.svelte';
	import TextAttribute from '$lib/attribute/components/text-attribute.svelte';
	import type { ProductDataModel } from '../product-type';
	import { getProduct } from '../product-service';

	type Props = {
		productId: string;
	};

	let { productId }: Props = $props();

	let productPromise: Promise<ProductDataModel | null> = $derived.by(async () => {
		return await getProduct(productId);
	});
</script>

{#await productPromise}
	<div><Spinner /></div>
{:then product}
	<div class="flex flex-col h-full">
		<div class="px-6">
			<table class=" ">
				<tbody>
					<tr>
						<td>Name</td>
						<td class="font-bold">{product?.name || '-'}</td>
					</tr>
					<tr>
						<td>Product MRP</td>
						<td><TextCurrency input={product?.mrp || 0} hasSymbol symbol="₹" /></td>
					</tr>
					<tr>
						<td>Sales Price</td>
						<td><TextCurrency input={product?.salePrice || 0} hasSymbol symbol="₹" /></td>
					</tr>
					<tr>
						<td>Brand</td><td><TextAttribute input={product?.brand || '-'}  /> </td>
					</tr>
					<tr>
						<td>Seller</td><td><TextUser input={product?.seller || '-'} hideIcon /> </td>
					</tr>
				</tbody>
			</table>
		</div>
		<div class="mt-6 p-6  bg-base-100 dark:bg-base-700 flex-grow">
			<BaseDataModelDetails data={product!} />
		</div>
	</div>
{/await}

<style>
	td:nth-child(1) {
		color: var(--color-base-400);
		width: 180px;
	}
	td:nth-child(2) {
		color: var(--color-base-500);
		width: 180px;
	}
</style>
