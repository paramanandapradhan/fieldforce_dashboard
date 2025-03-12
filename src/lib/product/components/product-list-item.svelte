<script lang="ts">
	import { Button, TextCurrency } from '@cloudparker/moldex.js';
	import type { ProductDataModel } from '../product-type';
	import ButtonIncrement from '$lib/core/components/button-increment.svelte';

	type Props = {
		product: ProductDataModel;
		quantity?: number;
	};

	let { product, quantity = 0 }: Props = $props();
	let price = $derived((product.salesPrice || 0) * quantity);
</script>

<div class="flex gap-4">
	<div class="flex-grow">
		<div class="font-bold">
			<div>
				{product?.name || ''}
			</div>
		</div>
		<div class="flex items-center gap-2">
			<span class="text-sm font-bold text-primary">
				<TextCurrency input={product.salesPrice || 0} symbol="₹" hasSymbol />
			</span>
			<span class="text-base-500 text-sm font-thin line-through">
				<TextCurrency input={product.mrp || 0} symbol="₹" hasSymbol />
			</span>
		</div>
		<div class="text-sm font-thin text-base">{product.desc}</div>
	</div>
	<div>
		<div>
			<ButtonIncrement bind:value={quantity} />
		</div>
		{#if price}
			<div class="text-center text-sm text-base font-thin pt-2">
				<TextCurrency input={price || 0} symbol="₹" hasSymbol />
			</div>
		{/if}
	</div>
</div>
