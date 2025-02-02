<script lang="ts">
	import { getAuthOrg, refreshClaim } from '$lib/auth/services/auth-service.svelte';
	import { Button } from '@cloudparker/moldex.js';
	import type { OrgDataModel } from '../org-types';
	import { openBillingEditDialog } from '../org-ui-service';
	import { mdiPencil } from '$lib/core/services/app-icons-service';

	let org: OrgDataModel | null = $derived.by(() => {
		return getAuthOrg();
	});

	async function handleEditBilling() {
		if (org) {
			try {
				const result = await openBillingEditDialog(org);
				if (result) {
					refreshClaim();
				}
			} catch (error) {
				console.error('Error editing billing information:', error);
			}
		}
	}
</script>

<div
	class="bg-white dark:bg-base-800 text-base-500 dark:text-base-300 rounded-xl shadow-lg p-4 sm:p-6 max-w-lg w-full mx-auto"
>
	<!-- Header with Edit Button -->
	<div class="flex justify-between items-center mb-4">
		<h3 class="text-base-800 font-bold">Billing Address</h3>
		<Button
			appearance="none"
			onClick={() => handleEditBilling()}
			iconPath={mdiPencil}
			iconClassName="text-base-400 hover:text-base-800"
		/>
	</div>

	<!-- Responsive Table Wrapper -->
	<div class="overflow-x-auto">
		<table class="min-w-full border-collapse">
			<tbody>
				<tr>
					<td class=" px-4 font-semibold text-base-800 dark:text-base-200">Name</td>
					<td class=" px-4">{org?.billing?.name || '-'}</td>
				</tr>
				<tr>
					<td class=" px-4 font-semibold text-base-800 dark:text-base-200">Email</td>
					<td class=" px-4">{org?.billing?.email || '-'}</td>
				</tr>
				<tr>
					<td class=" px-4 font-semibold text-base-800 dark:text-base-200">Phone</td>
					<td class="px-4">{org?.billing?.phone || '-'}</td>
				</tr>
				<tr>
					<td class=" px-4 font-semibold text-base-800 dark:text-base-200">Address</td>
					<td class=" px-4">{org?.billing?.address || '-'}</td>
				</tr>
				<tr>
					<td class=" px-4 font-semibold text-base-800 dark:text-base-200">Country</td>
					<td class=" px-4">{org?.billing?.country || '-'}</td>
				</tr>
				<tr>
					<td class="px-4 font-semibold text-base-800 dark:text-base-200">Pin Code</td>
					<td class="px-4">{org?.billing?.pincode || '-'}</td>
				</tr>
			</tbody>
		</table>
	</div>
</div>
