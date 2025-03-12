<script lang="ts">
	import { addToCart, getCartItems } from '$lib/cart/cart-service';
	import type { CartDataModel } from '$lib/cart/cart-types';
	import ProductCartListItem from '$lib/product/components/product-cart-list-item.svelte';
	import { getAllProducts } from '$lib/product/product-service';

	import type { ProductDataModel } from '$lib/product/product-type';
	import { sort } from '@cloudparker/moldex.js';
	import { onMount } from 'svelte';

	type Props = {
		customerId: string;
	};

	let { customerId }: Props = $props();

	let cartItems: CartDataModel[] = $state([]);

	let products: ProductDataModel[] = $state([]);

	let productQuantityMap: { [key: string]: number } = {};

	async function loadProducts() {
		let array = await getAllProducts();
		products = sort({ array, field: 'name' });
		mapProductsAndQuantity();
	}

	function mapProductsAndQuantity() {
		cartItems.forEach((item) => {
			let product = products.find((p) => p._id == item.product);
			if (product?._id) {
				productQuantityMap[product._id] = item.quantity || 0;
			}
		});
	}

	async function loadCartItems() {
		cartItems = (await getCartItems(customerId)) || [];
		mapProductsAndQuantity();
	}

	function getCartItemQuantity(product: ProductDataModel) {
		return productQuantityMap[product._id!] || 0;
	}

	async function handleQuantityChange(product: ProductDataModel, qty: number) {
		await addToCart(product, qty, customerId);
		await loadCartItems();
	}

	onMount(async () => {
		await loadCartItems();
		await loadProducts();
	});
</script>

<div class="px-6">
	{#each products as product}
		{@const quantity = getCartItemQuantity(product)}
		<div class="my-2 p-4 shadow-sm bg-white rounded">
			<ProductCartListItem
				{product}
				{quantity}
				onQuantityChange={(qty: number) => handleQuantityChange(product, qty)}
			/>
		</div>
	{/each}
</div>
