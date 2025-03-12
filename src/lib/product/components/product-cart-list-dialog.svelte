<script lang="ts">
	import ProductCartListItem from '$lib/product/components/product-cart-list-item.svelte';
	import { getAllProducts } from '$lib/product/product-service';

	import type { ProductDataModel } from '$lib/product/product-type';
	import { sort } from '@cloudparker/moldex.js';
	import { onMount } from 'svelte';

	type Props = {};

	let {}: Props = $props();

	let products: ProductDataModel[] = $state([]);

	async function loadProducts() {
		let array = await getAllProducts();
		products = sort({ array, field: 'name' });
	}

	onMount(() => {
		loadProducts();
	});
</script>

<div class="px-6">
	{#each products as product}
		<div class="my-2 p-4 shadow-sm bg-white rounded">
			<ProductCartListItem {product} />
		</div>
	{/each}
</div>
