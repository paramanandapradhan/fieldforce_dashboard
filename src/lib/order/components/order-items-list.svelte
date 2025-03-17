<script lang="ts">
	import { onMount } from 'svelte';
	import type { OrderDataModel } from '../order-type';
	import { getOrder } from '../order-service';
	import { getAllProducts } from '$lib/product/product-service';
	import type { ProductDataModel } from '$lib/product/product-type';
	import { TextCurrency } from '@cloudparker/moldex.js';

	type Props = {
		orderId: any;
	};

	let { orderId }: Props = $props();

	let order: OrderDataModel | null = $state(null);
	let products: ProductDataModel[] = $state([]);
	let productMap: { [key: string]: ProductDataModel } = $state({});

	async function loadOrder() {
		order = await getOrder(orderId);
	}

	async function loadProducts() {
		products = (await getAllProducts()) || [];
		productMap = products.reduce((acc: any, prod) => {
			acc[prod._id!] = prod;
			return acc;
		}, {});
	}

	onMount(async () => {
		await loadProducts();
		await loadOrder();
	});
</script>

<div class="">
	<h3 class="text-lg font-medium mt-4 mb-1 text-base-800 dark:text-base-200">Items</h3>
	<table class="min-w-full divide-y divide-base-200 dark:divide-base-600 table-fixed py-1">
		<thead>
			<tr class="text-base-400">
				<th>#</th>
				<th class="text-left">Product Name</th>
				<th class="text-left">Quantity</th>
				<th class="text-right">Sale Price</th>
			</tr>
		</thead>
		<tbody>
			{#each order?.items! as item, index}
				{@const product = productMap[item?.product!]}
				<tr class="text-base-400">
					<td>{index + 1}</td>
					<td>{product.name}</td>
					<td>{item.quantity}</td>
					<td class="text-right">
						<TextCurrency input={item.salePrice || 0} hasSymbol symbol="₹" />
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
