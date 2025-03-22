<script lang="ts">
	import { onMount } from 'svelte';
	import { getUser } from '../user-service';
	import type { CustomerDataModel } from '../user-types';
	import { Button, IconCircle } from '@cloudparker/moldex.js';
	import { mdiBriefcaseAccount, mdiBriefcaseAccountOutline, mdiInformationOutline } from '$lib/core/services/app-icons-service';
	import TextUserSubtype from './text-user-subtype.svelte';
	import TextAttribute from '$lib/attribute/components/text-attribute.svelte';
	import { openCustomerBasicDetailsDialog } from '../customer-ui-service';
	import { appState } from '$lib/core/services/app-state.svelte';

	type Props = {
		customerId: any;
	};

	let { customerId }: Props = $props();
	let customer: CustomerDataModel | null = $state(null);

	async function loadCustomers() {
		if (customerId) {
			customer = await getUser(customerId);
		} else {
			customer = null;
		}
	}
	async function handleOpenCustomerBasicInfo(customer: CustomerDataModel) {
		if (customer?._id) {
			await openCustomerBasicDetailsDialog(customer._id);
		}
	}

	onMount(() => {
		loadCustomers();
	});
</script>

<div>
	<div class="flex items-center gap-4">
		<div>
			<IconCircle
				iconPath={mdiBriefcaseAccountOutline}
				iconClassName="  text-primary"
				circleClassName=" "
			/>
		</div>
		<div class="flex-grow">
			<h4 class="text-xl font-bold dark:text-base-200">Customer Details</h4>
		</div>
		<div>
			<Button
				iconPath={mdiInformationOutline}
				className="!px-2"
				onClick={() => handleOpenCustomerBasicInfo(customer!)}
				iconClassName="text-base-400 hover:text-base-800 {appState.theme == 'light'
					? ''
					: 'dark:hover:text-base-200'}"
			/>
		</div>
	</div>

	<div class="mt-6">
		<table>
			<tbody>
				<tr class="lg:text-lg lg:font-bold font-semibold"
					><td>Name</td><td>{customer?.name || '-'}</td></tr
				>
				<tr><td>Description</td><td class="text-sm">{customer?.desc || '-'}</td></tr>
				<tr><td>Email</td><td>{customer?.email || '-'}</td></tr>
				<tr><td>Phone No</td><td>{customer?.phone || '-'}</td></tr>
				<tr><td>Type</td><td><TextUserSubtype input={customer?.subtype} /></td></tr>
				<tr><td>Categori</td><td><TextAttribute input={customer?.categories} /></td> </tr>
				<tr><td>Address</td><td>{customer?.address || '-'}</td></tr>
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
		word-break: break-word;
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
