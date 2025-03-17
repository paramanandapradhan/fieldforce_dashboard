<script lang="ts">
	import { onMount } from 'svelte';
	import { getOrder } from '../order-service';
	import type { OrderDataModel } from '../order-type';
	import { getProduct } from '$lib/product/product-service';
	import { IconCircle, TextDate } from '@cloudparker/moldex.js';
	import {
		mdiPackageVariantClosed,
		mdiTextBoxCheckOutline
	} from '$lib/core/services/app-icons-service';
	import TextUser from '$lib/user/components/text-user.svelte';
	import TextAttribute from '$lib/attribute/components/text-attribute.svelte';

	type Props = {
		orderId: any;
	};

	let { orderId }: Props = $props();

	let order: OrderDataModel | null = $state(null);

	async function loadOrder() {
		order = await getOrder(orderId);
		console.log('order Details: ', order);

		if (order?.items && order.items.length > 0) {
			order.items = await Promise.all(
				order.items.map(async (item) => {
					const product = await getProduct(item.product!);
					return {
						...item,
						productDetails: product
					};
				})
			);
		}
	}

	onMount(() => {
		loadOrder();
	});
</script>

<div class="px-8">
	<!-- <h4 class="text-xl font-bold dark:text-base-200 mb-4">Order Details</h4> -->

	<div>
		<IconCircle
			iconPath={mdiTextBoxCheckOutline}
			iconClassName="text-primary"
			circleClassName=" "
		/>
	</div>

	<div>
		<table class="table-fixed w-full">
			<tbody>
				<tr>
					<td>ID</td> <td>{order?._id || '-'}</td>
				</tr>
				<tr>
					<td>Date</td> <td><TextDate input={order?.date || '-'} /> </td>
				</tr>
				<tr>
					<td>Customer</td><td><TextUser input={order?.customer || '-'} hideIcon /></td>
				</tr>
				<tr>
					<td>Seller</td><td><TextUser input={order?.seller || '-'} hideIcon /></td>
				</tr>
				<tr>
					<td>Order Type</td><td><TextAttribute input={order?.orderType || '-'} /></td>
				</tr>
				<tr>
					<td>Paymentmode</td><td><TextAttribute input={order?.paymentMode || '-'} /></td>
				</tr>
				<tr>
					<td>Amount</td><td>{order?.amount || '-'}</td>
				</tr>
				<tr>
					<td>Note</td><td>{order?.note || '-'}</td>
				</tr>
			</tbody>
		</table>
	</div>

	<div class="my-6">
		<h3 class="text-lg font-medium mt-4 mb-1 text-base-800 dark:text-base-200">Items</h3>
		<table class="min-w-full divide-y divide-base-200 dark:divide-base-600 table-fixed py-1">
			<thead>
				<tr class="text-base-400">
					<th class="text-left">Product Name</th>
					<th class="text-left">Quantity</th>
					<th class="text-left">Sale Price</th>
				</tr>
			</thead>
			<tbody>
				{#each order?.items! as item}
					<tr class="text-base-400">
						<td>{item.productDetails?.name || 'Unknown Product'}</td>
						<td>{item.quantity}</td>
						<td>{item.salePrice}</td>
					</tr>
				{/each}
			</tbody>
		</table>
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
			padding-left: 20px; /* Reduce left padding for tighter spacing */
		}
	}
</style>
