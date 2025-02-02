<script lang="ts">
	import { Spinner } from '@cloudparker/moldex.js';
	import { getPhone } from '../phone-service';
	import type { PhoneDataModel } from '../phone-types';
	import BaseDataModelDetails from '$lib/core/components/base-data-model-details.svelte';

	type Props = {
		phoneId: string;
	};

	let { phoneId }: Props = $props();

	let phonePromise: Promise<PhoneDataModel | null> = $derived.by(async () => {
		return await getPhone(phoneId);
	});
</script>

{#await phonePromise}
	<div><Spinner /></div>
{:then phone}
	<div class="flex flex-col h-full">
		<div class="px-6">
			<table class=" ">
				<tbody>
					<tr>
						<td>Phone Number</td>
						<td class="font-bold">{phone?.number || '-'}</td>
					</tr>
					<tr>
						<td>Description</td>
						<td>{phone?.desc || '-'}</td>
					</tr>
				</tbody>
			</table>
		</div>
		<div class="mt-6 p-6 border-t bg-base-100 flex-grow">
			<BaseDataModelDetails data={phone!} />
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
