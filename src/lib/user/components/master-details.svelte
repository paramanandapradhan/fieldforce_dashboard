<script lang="ts">
	import { onMount } from 'svelte';
	import { getUser } from '../user-service';
	import type { CustomerDataModel } from '../user-types';
	import { IconCircle, TextDate } from '@cloudparker/moldex.js';
	import { mdiBriefcaseAccount } from '$lib/core/services/app-icons-service';
	import TextUserSubtype from './text-user-subtype.svelte';
	import TextAttribute from '$lib/attribute/components/text-attribute.svelte';
	import TextUser from './text-user.svelte';
	import type { RouteDataModel } from '$lib/route/route-types';
	import { getRoute } from '$lib/route/route-service';

	type Props = {
		customerId: any;
	};

	let { customerId }: Props = $props();
	let customer: CustomerDataModel | null = $state(null);
	let routeName: string = $state('');

	async function loadCustomers() {
		if (customerId) {
			customer = await getUser(customerId);

			if(customer?.master?.route){
				const route:RouteDataModel |null = await getRoute(customer.master.route);
				routeName = route?.name || ''
			}
		} else {
			customer = null;
		}
	}

	onMount(() => {
		loadCustomers();
	});
</script>

<div>
	<h4 class="text-xl font-bold mb-4 dark:text-base-300">Master Details</h4>
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
						><td>SM</td><td><TextUser input={customer?.master?.sm || '-'} hideIcon/></td></tr
					>
					<tr><td>TSM</td><td><TextUser input ={customer?.master?.tsm || '-'} hideIcon/></td></tr
					>
					<tr><td>Distributor</td><td><TextUser input={customer?.master?.distributor || '-'} hideIcon/></td></tr>
					<tr><td>Route</td><td>{routeName}</td></tr>
					<tr><td>Class</td><td><TextAttribute input={customer?.master?.clazz}/></td></tr>
					<tr
						><td>Chain</td><td><TextAttribute input={customer?.master?.chain} /></td>
					</tr>
					<tr><td>Company</td><td>{customer?.master?.company || '-'}</td></tr>
					<tr><td>Label</td><td>{customer?.master?.label || '-'}</td></tr>
					<tr><td>External Id</td><td>{customer?.master?.extId || '-'}</td> </tr>
					<tr><td>Creadit Limit</td><td>{customer?.master?.creditLimit || '-'}</td></tr>
					<tr><td>DOJ</td><td><TextDate input={customer?.cat || '-'}/> </td></tr>
					
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
