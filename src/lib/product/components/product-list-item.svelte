<script lang="ts">
	import { Button } from '@cloudparker/moldex.js';
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
		<div class="text-sm font-thin text-base">{product.desc}</div>
	</div>
	<div>
		<ButtonIncrement value={quantity} />
	</div>
</div>
