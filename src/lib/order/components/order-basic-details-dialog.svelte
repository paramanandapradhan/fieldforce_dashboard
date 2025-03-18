<script lang="ts">
	import { Spinner, TextCurrency, TextDate } from '@cloudparker/moldex.js';
	import BaseDataModelDetails from '$lib/core/components/base-data-model-details.svelte';
	import type { OrderDataModel } from '../order-type';
	import { getOrder } from '../order-service';
	import TextUser from '$lib/user/components/text-user.svelte';
	import TextAttribute from '$lib/attribute/components/text-attribute.svelte';

	type Props = {
		orderId: string;
	};

	let { orderId }: Props = $props();

	let orderPromise: Promise<OrderDataModel | null> = $derived.by(async () => {
		return await getOrder(orderId);
	});
</script>

{#await orderPromise}
	<div><Spinner /></div>
{:then order}
	<div class="flex flex-col h-full">
		<div class="px-6">
			<table class=" ">
				<tbody>
					<tr>
						<td>Order Id</td>
						<td class="font-bold">{order?._id || '-'}</td>
					</tr>
					<tr>
						<td>Date</td>
						<td><TextDate input={order?.date || '-'} /> </td>
					</tr>
					<tr>
						<td>Amount</td>
						<td><TextCurrency input={order?.amount || 0} hasSymbol symbol="₹" /></td>
					</tr>
					<tr>
						<td>Customer</td><td><TextUser input={order?.customer || '-'} hideIcon /> </td>
					</tr>
					<tr>
						<td>Status</td><td><TextAttribute input={order?.status || '-'} /> </td>
					</tr>
				</tbody>
			</table>
		</div>
		<div class="mt-6 p-6  bg-base-100 dark:bg-base-700 flex-grow">
			<BaseDataModelDetails data={order!} />
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
