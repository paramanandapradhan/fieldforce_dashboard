<script lang="ts">
	import { addToCart, getCartItems } from '$lib/cart/cart-service';
	import type { CartDataModel } from '$lib/cart/cart-types';
	import {
		mdiAccount,
		mdiCart,
		mdiChevronDoubleRight,
		mdiHeart,
		mdiHeartOutline
	} from '$lib/core/services/app-icons-service';
	import ProductCartListItem from '$lib/product/components/product-cart-list-item.svelte';
	import { getAllProducts } from '$lib/product/product-service';

	import type { ProductDataModel } from '$lib/product/product-type';
	import {
		Button,
		ButtonSearch,
		Icon,
		openDialog,
		showToast,
		sort,
		TextCurrency,
		type DialogExports
	} from '@cloudparker/moldex.js';
	import { onMount } from 'svelte';
	import ProductCartButton from './product-cart-button.svelte';
	import CartListDialog from '$lib/cart/components/cart-list-dialog.svelte';

	type Props = {
		customerId: string;
	};

	let { customerId, setHeaderSnippet, setFooterSnippet }: DialogExports & Props = $props();

	let cartItems: CartDataModel[] = $state([]);

	let products: ProductDataModel[] = $state([]);

	let productQuantityMap: { [key: string]: number } = {};

	let totalQuantity: number = $derived.by(() => {
		return (cartItems || []).reduce((acc: number, item) => {
			acc += item.quantity || 0;
			return acc;
		}, 0);
	});

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

	async function handleQuantityChange(product: ProductDataModel, quantity: number) {
		await addToCart({ product, quantity, uid: customerId, salePrice: product.salePrice || 0 });
		await loadCartItems();
	}

	async function handleCartClick() {
		if (totalQuantity) {
			let res = await openDialog({
				bodyComponent: CartListDialog,
				props: {
					customerId
				},
				title: `Cart (${totalQuantity})`,
				hasHeader: true,
				hasFooter: true,
				hasTitle: true,
			});
		} else {
			showToast({ msg: 'No items in cart!' });
		}
	}

	async function load() {
		setFooterSnippet(footerSnippet);
		setHeaderSnippet(headerSnippet);
		await loadCartItems();
		await loadProducts();
	}

	onMount(async () => {
		load();
	});
</script>

{#snippet headerSnippet()}
	<div class="flex">
		<Button iconPath={mdiHeartOutline}></Button>
		<ButtonSearch></ButtonSearch>
		<ProductCartButton {totalQuantity} onClick={handleCartClick}></ProductCartButton>
	</div>
{/snippet}

{#snippet footerSnippet()}
	<div class="flex">
		<Button
			appearance="primary"
			className="px-8"
			disabled={!totalQuantity}
			onClick={handleCartClick}
		>
			<div>Proceed</div>
			<div>
				<Icon path={mdiChevronDoubleRight}></Icon>
			</div>
		</Button>
	</div>
{/snippet}

<div class="px-6">
	{#each products as product}
		{@const quantity = getCartItemQuantity(product)}
		<div class="my-2 p-4 shadow-sm bg-white rounded dark:bg-base-700">
			<ProductCartListItem
				{product}
				{quantity}
				onQuantityChange={(qty: number) => handleQuantityChange(product, qty)}
			/>
		</div>
	{/each}
</div>
