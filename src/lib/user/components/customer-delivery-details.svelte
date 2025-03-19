<script lang="ts">
	import { onMount } from 'svelte';
	import { getUser } from '../user-service';
	import type { CustomerDataModel } from '../user-types';
	import { IconCircle, TextDate } from '@cloudparker/moldex.js';
	import { mdiBriefcaseAccount } from '$lib/core/services/app-icons-service';
	import TextUserSubtype from './text-user-subtype.svelte';
	import TextAttribute from '$lib/attribute/components/text-attribute.svelte';
	import TextUser from './text-user.svelte';

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

	onMount(() => {
		loadCustomers();
	});
</script>

<div class="w-full">
	<div class="flex items-center gap-4">
		<div>
			<IconCircle
				iconPath={mdiBriefcaseAccount}
				iconClassName="  text-primary"
				circleClassName=" "
			/>
		</div>
		<h4 class="text-xl font-bold dark:text-base-300">Delivery Details</h4>
	</div>
	<div class="mt-6">
		<table>
			<tbody>
				<tr class="lg:text-lg lg:font-bold font-semibold"
					><td>Name</td><td>{customer?.delivery?.name || '-'}</td></tr
				>

				<tr><td>Email</td><td>{customer?.delivery?.email || '-'}</td></tr>
				<tr><td>Phone</td><td>{customer?.delivery?.phone || '-'}</td></tr>
				<tr><td>Address</td><td>{customer?.delivery?.address || '-'}</td></tr>
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
			padding-left: 8px; /* Reduce left padding for tighter spacing */
		}
	}
</style>
