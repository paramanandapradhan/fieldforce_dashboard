<script lang="ts">
	import { Button, TextCurrency } from '@cloudparker/moldex.js';
	import type { ProductDataModel } from '../product-type';
	import ButtonIncrement from '$lib/core/components/button-increment.svelte';

	type Props = {
		product: ProductDataModel;
		quantity?: number;
		onQuantityChange?: (qty: number) => void;
	};

	let { product, quantity = 0, onQuantityChange }: Props = $props();
	let price = $derived((product.salePrice || 0) * quantity);
</script>

<div class="flex gap-4">
	<div class="flex-grow">
		<div class="font-bold dark:text-base-200">
			<div>
				{product?.name || ''}
			</div>
		</div>
		<div class="flex items-center gap-2">
			<span class="text-sm font-bold text-primary dark:text-base-400">
				<TextCurrency input={product.salePrice || 0} symbol="₹" hasSymbol />
			</span>
			<span class="text-base-500 text-sm font-thin line-through dark:text-base-500">
				<TextCurrency input={product.mrp || 0} symbol="₹" hasSymbol />
			</span>
		</div>
		<div class="text-sm font-thin text-base dark:text-base-400">{product.desc}</div>
	</div>
	<div>
		<div>
			<ButtonIncrement bind:value={quantity} onChange={onQuantityChange} />
		</div>
		{#if price}
			<div class="text-center text-sm text-base font-thin pt-2 dark:text-base-400">
				<TextCurrency input={price || 0} symbol="₹" hasSymbol />
			</div>
		{/if}
	</div>
</div>
