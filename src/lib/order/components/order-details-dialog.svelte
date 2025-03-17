<script lang="ts">
	import { onMount } from 'svelte';
	import { getOrder } from '../order-service';
	import type { OrderDataModel } from '../order-type';
	import { getProduct } from '$lib/product/product-service';
	import { IconCircle, TextCopy, TextCurrency, TextDate } from '@cloudparker/moldex.js';
	import {
		mdiPackageVariantClosed,
		mdiTextBoxCheckOutline
	} from '$lib/core/services/app-icons-service';
	import TextUser from '$lib/user/components/text-user.svelte';
	import TextAttribute from '$lib/attribute/components/text-attribute.svelte';
	import OrderItemsList from './order-items-list.svelte';

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
	<div>
		<table class="table-fixed w-full text-base dark:text-base-300">
			<tbody>
				<tr>
					<td>ID</td>
					<td
						>
						<TextCopy
							input={order?._id || '-'}
							buttonClassName="dark:bg-base-700 ms-4"
							iconClassName="!h-4 !w-4"
						/>
					</td>
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
					<td>Payment Mode</td><td><TextAttribute input={order?.paymentMode || '-'} /></td>
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
		<OrderItemsList {orderId} />
		<div class="text-right text-base dark:text-base-300 font-black flex justify-end mt-6">
			<div class="border-t py-4">
				Total : <TextCurrency input={order?.amount || 0} hasSymbol symbol="₹" />
			</div>
		</div>
	</div>
</div>

<style>
	td:nth-child(1) {
		opacity: 0.6;
		width: 180px;
	}
</style>
