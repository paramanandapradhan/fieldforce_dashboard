<script lang="ts">
	import { Spinner, TextCurrency, TextDate } from '@cloudparker/moldex.js';
	import BaseDataModelDetails from '$lib/core/components/base-data-model-details.svelte';
	import TextUser from '$lib/user/components/text-user.svelte';
	import TextAttribute from '$lib/attribute/components/text-attribute.svelte';
	import type { CustomerDataModel, UserDataModel } from '../user-types';
	import { getUser } from '../user-service';
	import TextUserSubtype from './text-user-subtype.svelte';

	type Props = {
		userId: string;
	};

	let { userId }: Props = $props();

	let userPromise: Promise<UserDataModel | null> = $derived.by(async () => {
		return await getUser(userId);
	});
</script>

{#await userPromise}
	<div><Spinner /></div>
{:then user}
	<div class="flex flex-col h-full">
		<div class="px-6">
			<table class=" ">
				<tbody>
					<tr>
						<td>Name</td>
						<td class="font-bold">{user?.name || '-'}</td>
					</tr>
					<tr>
						<td>Desc</td>
						<td class="font-thin">{user?.desc || '-'}</td>
					</tr>
					<tr>
						<td>Phone No</td><td>{user?.phone || '-'}</td>
					</tr>
					<tr>
						<td>Email</td><td>{user?.email || '-'}</td>
					</tr>
					<tr>
						<td>Type</td>
						<td><TextUserSubtype input={user?.subtype! || '-'} /></td>
					</tr>
				</tbody>
			</table>
		</div>
		<div class="mt-6 p-6 bg-base-100 dark:bg-base-700 flex-grow">
			<BaseDataModelDetails data={user!} />
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
