<script lang="ts">
	import { onMount } from 'svelte';
	import { getProduct } from '../product-service';
	import type { ProductDataModel } from '../product-type';
	import { Button, IconCircle, TextCurrency } from '@cloudparker/moldex.js';
	import {
		mdiInformationOutline,
		mdiPackageVariantClosed
	} from '$lib/core/services/app-icons-service';
	import TextAttribute from '$lib/attribute/components/text-attribute.svelte';
	import TextUser from '$lib/user/components/text-user.svelte';
	import { openProductBasicDetailsDialog } from '../product-ui-service';

	type Props = {
		productId: any;
	};

	let { productId }: Props = $props();
	let product: ProductDataModel | null = $state(null);

	async function loadProduct() {
		if (productId) {
			product = await getProduct(productId);
		} else {
			product = null;
		}
	}

	async function handleOpenProductBasicInfo(ev: MouseEvent, product: ProductDataModel) {
		ev.stopPropagation();
		if (product?._id) {
			await openProductBasicDetailsDialog(product._id);
		}
	}

	onMount(() => {
		loadProduct();
	});
</script>

<div>
	<div class="flex items-center gap-4">
		<div>
			<IconCircle
				iconPath={mdiPackageVariantClosed}
				iconClassName="text-primary"
				circleClassName=" "
			/>
		</div>
		<div class="flex-grow">
			<h4 class="text-xl font-bold dark:text-base-200">Product Details</h4>
		</div>
		<div>
			<Button
				iconPath={mdiInformationOutline}
				className="!px-2"
				onClick={(ev) => handleOpenProductBasicInfo(ev, product!)}
				iconClassName="text-base-400 hover:text-base-800 dark:hover:text-base-200}"
			/>
		</div>
	</div>

	<div class="flex md:flex-row flex-col gap-4 mt-6">
		<div>
			<table class="table-fixed w-full">
				<tbody>
					<tr class="lg:text-lg lg:font-bold font-semibold">
						<td>Name</td><td>{product?.name || '-'}</td>
					</tr>
					<tr><td>Description</td><td class="text-base-500 text-sm">{product?.desc || '-'}</td></tr>
					<tr
						><td>MRP</td><td><TextCurrency input={product?.mrp || 0} hasSymbol symbol="₹" /></td
						></tr
					>
					<tr
						><td>Sales Price</td><td
							><TextCurrency input={product?.salePrice || 0} hasSymbol symbol="₹" /></td
						></tr
					>
					<tr><td>Type</td><td><TextAttribute input={product?.type || '-'} /> </td></tr>
					<tr><td>UMO</td><td> <TextAttribute input={product?.umo || '-'} /></td></tr>
					<tr><td>Categories</td><td><TextAttribute input={product?.categories || '-'} /></td></tr>
					<tr><td>Brand</td><td><TextAttribute input={product?.brand || '-'} /> </td></tr>
					<tr><td>Batch</td><td>{product?.batch || ''}</td></tr>
					<tr><td>Seller</td><td><TextUser input={product?.seller || '-'} hideIcon /> </td></tr>
					<tr><td>Details</td><td>{product?.details || '-'}</td></tr>
					<tr><td>Note</td><td>{product?.note || '-'}</td></tr>
				</tbody>
			</table>
		</div>
	</div>
</div>

<style>
	td:nth-child(1) {
		color: var(--color-base-400);
		width: 180px;
	}
	td:nth-child(2) {
		color: var(--color-base-500);
		height: 40px;
		width: auto;
		max-width: 500px;
		word-wrap: break-word;
		overflow-wrap: break-word;
	}

	/* Responsive adjustments for small screens */
	@media (max-width: 768px) {
		td:nth-child(1) {
			width: 100px; /* Further reduce width on small screens */
		}
		td:nth-child(2) {
			max-width: 100%; /* Allow full width on small screens */
			padding-left: 8px; /* Reduce left padding for tighter spacing */
		}
	}
</style>
