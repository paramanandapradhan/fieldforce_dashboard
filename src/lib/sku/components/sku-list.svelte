<script lang="ts">
	import { onMount } from 'svelte';
	import type { SkuDataModel } from '../sku-types';
	import { getAllSkus } from '../sku-service';
	import { ButtonMenu, mdiDotsHorizontal, TextDate } from '@cloudparker/moldex.js';
	import { openSkuDeleteDialog, openSkuEditDialog } from '../sku-ui-service';

	let skus: SkuDataModel[] = $state([]);

	export async function loadSkus() {
		skus = await getAllSkus();
	}

	async function handleMenu(ev: MouseEvent, menu: string, skus: SkuDataModel) {
		switch (menu) {
			case 'Edit':
				await openSkuEditDialog(skus);
				await getAllSkus();
				break;
			case 'Delete':
				await openSkuDeleteDialog(skus);
				await getAllSkus();
				break;
		}
	}

	onMount(() => {
		loadSkus();
	});
</script>

<div
	class=" bg-white dark:bg-base-700 text-base-800 dark:text-base-300 shadow-lg rounded-lg p-4 pt-4 min-h-72 overflow-x-auto "
>
	<table class="w-full">
		<thead class="bg-base-50 dark:bg-base-800 text-base-800 dark:text-base-300">
			<tr>
				<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Id</th>
				<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
				<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Description</th
				>
				<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Price</th>
				<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
					>Discount (%)</th
				>
				<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
					>Discount End</th
				>
				<th></th>
			</tr>
		</thead>
		<tbody class="divide-y divide-base-200 dark:divide-base-300">
			{#each skus as sku}
				<tr class="hover:bg-base-50 dark:hover:bg-base-700 text-base-800 dark:text-base-300">
					<td class="px-6 py-2 text-sm">{sku._id || '-'}</td>
					<td class="px-6 py-2 text-sm">{sku.name || '-'}</td>
					<td class="px-6 py-2 text-sm">{sku.desc || '-'}</td>
					<td class="px-6 py-2 text-sm">{sku.price?.toFixed(2) || '-'}</td>
					<td class="px-6 py-2 text-sm">{sku.dis ? `${sku.dis}%` : '-'}</td>
					<td class="px-6 py-2 text-sm">
						{#if sku.deat}
							<TextDate input={sku.deat} />
						{:else}
							-
						{/if}
					</td>
					<td >
						<ButtonMenu
							menus={['Edit', 'Delete']}
							iconPath={mdiDotsHorizontal}
							iconClassName="text-base-400 hover:text-base-800"
							onMenu={(ev, menu) => handleMenu(ev, menu as string, sku)}
						/>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
