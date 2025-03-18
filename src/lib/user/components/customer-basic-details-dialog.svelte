<script lang="ts">
	import { Spinner, TextCurrency, TextDate } from '@cloudparker/moldex.js';
	import BaseDataModelDetails from '$lib/core/components/base-data-model-details.svelte';
	import TextUser from '$lib/user/components/text-user.svelte';
	import TextAttribute from '$lib/attribute/components/text-attribute.svelte';
	import type { CustomerDataModel } from '../user-types';
	import { getUser } from '../user-service';
	import TextUserSubtype from './text-user-subtype.svelte';
	

	type Props = {
		customerId: string;
	};

	let { customerId }: Props = $props();

	let customerPromise: Promise<CustomerDataModel | null> = $derived.by(async () => {
		return await getUser(customerId);
	});
</script>

{#await customerPromise}
	<div><Spinner /></div>
{:then customer}
	<div class="flex flex-col h-full">
		<div class="px-6">
			<table class=" ">
				<tbody>
					<tr>
						<td>Name</td>
						<td class="font-bold">{customer?.name || '-'}</td>
					</tr>
					<tr>
						<td>Desc</td>
						<td class="font-thin">{customer?.desc || '-'}</td>
					</tr>
                    <tr>
                        <td>Phone No</td><td>{customer?.phone || '-'}</td>
                    </tr>
                    <tr>
                        <td>Email</td><td>{customer?.email || '-'}</td>
                    </tr>
					<tr>
						<td>Type</td>
						<td><TextUserSubtype input={customer?.subtype! || '-'} /></td>
					</tr>
					<tr>
						<td>City</td>
						<td><TextAttribute input={customer?.geo?.city} /></td>
					</tr>
					<tr>
						<td>Area</td><td><TextAttribute input={customer?.geo?.area} /> </td>
					</tr>
					
				</tbody>
			</table>
		</div>
		<div class="mt-6 p-6  bg-base-100 dark:bg-base-700 flex-grow">
			<BaseDataModelDetails data={customer!} />
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
