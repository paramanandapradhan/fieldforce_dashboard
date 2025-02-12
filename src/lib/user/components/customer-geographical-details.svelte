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
	<h4 class="text-xl font-bold mb-4">Geographical Details</h4>
	<div class="flex md:flex-row flex-col gap-4">
		<div>
			<IconCircle
				iconPath={mdiBriefcaseAccount}
				iconClassName="  text-primary"
				circleClassName=" "
			/>
		</div>
		<div>
			<table>
				<tbody>
					<tr class="lg:text-lg lg:font-bold font-semibold"
						><td>Country</td><td><TextAttribute input={customer?.geo?.country}/> </td></tr
					>

					<tr><td>State</td><td><TextAttribute input={customer?.geo?.state}/> </td></tr>
					<tr><td>City</td><td><TextAttribute input={customer?.geo?.city}/> </td></tr>
					<tr><td>District</td><td><TextAttribute input={customer?.geo?.district}/>  </td></tr>
					<tr><td>Area</td><td><TextAttribute input={customer?.geo?.area}/> </td></tr>
                    <tr><td>Locality</td><td>{customer?.geo?.locality || '-'}</td></tr>
                    <tr><td>Street</td><td>{customer?.geo?.street || '-'}</td></tr>
                    <tr><td>LandMark</td><td>{customer?.geo?.landmark || '-'}</td></tr>
                    <tr><td>Pincode</td><td>{customer?.geo?.pincode || '-'}</td></tr>
                    <tr><td>Location(lat,long)</td><td>{customer?.geo?.location || '-'}</td></tr>
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
