<script lang="ts">
	import { Button, TextCurrency } from '@cloudparker/moldex.js';
	import type { ProductDataModel } from '../product-type';
	import ButtonIncrement from '$lib/core/components/button-increment.svelte';

	type Props = {
		product: ProductDataModel;
		quantity?: number;
	};

	let { product, quantity = 0 }: Props = $props();
</script>

<div class="flex gap-4">
	<div class="flex-grow">
		<div class="font-bold">{product?.name}</div>
		<div class="flex items-center gap-2">
			<span class="text-sm font-bold text-primary">
				<TextCurrency input={product.salesPrice || 0} symbol="Rs." hasSymbol />
			</span>
			<span class="text-base-400 text-sm font-thin line-through">
				<TextCurrency input={product.mrp || 0} symbol="Rs." hasSymbol />
			</span>
		</div>
		<div class="text-sm font-thin text-base">{product.desc}</div>
	</div>
	<div>
		<ButtonIncrement value={quantity} />
	</div>
</div>
