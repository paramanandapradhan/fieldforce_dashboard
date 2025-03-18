<script lang="ts">
	import { onMount } from 'svelte';
	import { getOrder, syncOrders, updateOrder } from '../order-service';
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
	import AttributeComboboxField from '$lib/attribute/components/attribute-combobox-field.svelte';
	import { AttributeTypeEnum } from '$lib/attribute/attribute-service';

	type Props = {
		orderId: any;
	};

	let { orderId }: Props = $props();

	let order: OrderDataModel | null = $state(null);

	let orderStatus: string = $state('');

	async function loadOrder() {
		order = await getOrder(orderId);
		orderStatus = order?.status || '';
		console.log('order Details: ', order);
	}

	async function handleOrderStausChange() {
		await updateOrder(orderId, { status: orderStatus });
		await syncOrders();
		await loadOrder();
	}

	onMount(() => {
		loadOrder();
	});
</script>

<div class="px-4">
	<div class="flex flex-col lg:flex-row gap-6">
		<div>
			<table class="table-fixed w-full text-base dark:text-base-300">
				<tbody>
					<tr>
						<td>ID</td>
						<td>
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
						<td>Amount</td><td><TextCurrency input={order?.amount || 0} hasSymbol symbol="₹" /></td>
					</tr>
					<tr>
						<td>Note</td><td>{order?.note || '-'}</td>
					</tr>
				</tbody>
			</table>
		</div>
		{#if orderStatus}
			<div class="min-w-60 bg-base-100 dark:bg-base-700 p-4 rounded">
				<AttributeComboboxField
					bind:value={orderStatus}
					attributeType={AttributeTypeEnum.ORDER_STATUS}
					label="Order Status"
					hasDropdownHeaderSearch={false}
					hasDropdownHeader={false}
					createButtonLabel="Create Status"
					onChange={handleOrderStausChange}
				/>
			</div>
		{/if}
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
		width: 140px;
	}
</style>
