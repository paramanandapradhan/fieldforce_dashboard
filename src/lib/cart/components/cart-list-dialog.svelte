<script lang="ts">
	import { addToCart, getCartItems } from '$lib/cart/cart-service';
	import type { CartDataModel } from '$lib/cart/cart-types';
	import ButtonIncrement from '$lib/core/components/button-increment.svelte';
	import { getAllProducts } from '$lib/product/product-service';

	import type { ProductDataModel } from '$lib/product/product-type';
	import TextUser from '$lib/user/components/text-user.svelte';
	import UserLoader from '$lib/user/components/user-loader.svelte';
	import type { CustomerDataModel } from '$lib/user/user-types';
	import {
		Button,
		Icon,
		sort,
		TextareaField,
		TextCurrency,
		type DialogExports
	} from '@cloudparker/moldex.js';
	import { onMount } from 'svelte';

	type Props = {
		customerId: string;
	};

	type ProductMap = { [key: string]: ProductDataModel };
	type QuantityMap = { [key: string]: number };

	let { customerId, setHeaderSnippet, setFooterSnippet }: DialogExports & Props = $props();

	let cartItems: CartDataModel[] = $state([]);

	let products: ProductDataModel[] = $state([]);

	let productQuantityMap: QuantityMap = $state({});
	let productMap: ProductMap = $state({});
	let customer: CustomerDataModel | null = $state(null);

	let totalQuantity: number = $derived.by(() => {
		return (cartItems || []).reduce((acc: number, item) => {
			acc += item.quantity || 0;
			return acc;
		}, 0);
	});

	let totalAmount: number = $derived.by(() => {
		return (cartItems || []).reduce((acc: number, item) => {
			// acc += (item.salePrice || 0) * (item.quantity || 0);
			acc += item.salePrice || 0;
			return acc;
		}, 0);
	});

	async function loadProducts() {
		let array = await getAllProducts();
		products = sort({ array, field: 'name' });
		productMap = products.reduce((acc, product) => {
			acc[product._id!] = product;
			return acc;
		}, {} as ProductMap);

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
		await addToCart({ product, quantity, salePrice: product.salePrice || 0, uid: customerId });
		await loadCartItems();
	}

	onMount(async () => {
		setFooterSnippet(footerSnippet);
		await loadCartItems();
		await loadProducts();
	});
</script>

{#snippet footerSnippet()}
	<div class="flex justify-between gap-12">
		<div>
			<div class="text-base-400 text-sm">Payble</div>
			<div class="font-bold text-sm text-base">
				<TextCurrency input={totalAmount} hasSymbol symbol="₹" />
			</div>
		</div>
		<Button appearance="primary" className="px-8" disabled={!totalQuantity}>
			<div>Place Order</div>
		</Button>
	</div>
{/snippet}

<div class="px-4">
	<section>
		<div>
			<h2 class="text-lg font-thin">Items</h2>
		</div>
		<div class="my-6">
			<table class="table-auto w-full text-base-700 dark:text-base-400 text-sm">
				<thead>
					<tr>
						<th>#</th>
						<th class="w-28">Item</th>
						<th class="text-right">Qty</th>
						<th class="text-right">Price</th>
						<th class="text-right">Amount</th>
					</tr>
				</thead>
				<tbody>
					{#each cartItems as item, index}
						{@const product = productMap[item.product!]}
						{#if product && item.quantity}
							<tr>
								<td>{index + 1}</td>
								<td>{product.name || ''}</td>
								<td class="text-right">{item.quantity || 0}</td>
								<!-- <td>
									<ButtonIncrement
										value={item.quantity}
										onChange={(qty) => handleQuantityChange(product, qty)}
									/>
								</td> -->
								<td class="text-right">
									<TextCurrency input={product.salePrice || 0} hasSymbol symbol="₹" />
								</td>
								<td class="text-right">
									<TextCurrency
										input={(product.salePrice || 0) * (item.quantity || 0)}
										hasSymbol
										symbol="₹"
									/>
								</td>
							</tr>
						{/if}
					{/each}
				</tbody>
			</table>
		</div>
	</section>
	<section
		class="flex justify-end pt-6 mt-6 border-t-2 border-base dark:text-base-300 dark:border-base-300 text-xl text-base ml-36 gap-6"
	>
		<div>Total :</div>
		<div>
			<TextCurrency input={totalAmount} hasSymbol symbol="₹" />
		</div>
	</section>
	<section class="my-6 mt-12 p-4 bg-base-100 rounded">
		<h3 class="text-lg py-2 text-base font-thin">Delivery Details</h3>
		<hr />
		<div class="my-4">
			<div class="font-bold"><TextUser input={customerId} hideIcon hideDropdown></TextUser></div>
			<UserLoader userId={customerId} bind:user={customer}>
				{#if customer}
					<div>
						<span class="text-base"> Phone : </span>

						{customer.delivery?.phone || ''}
					</div>
					<div>
						<span class="text-base">Email :</span>
						{customer.delivery?.email || ''}
					</div>
					<div>
						<div class="text-base">Address:</div>
						<div>
							<address>
								{customer.delivery?.address || ''}
							</address>
						</div>
					</div>
				{/if}
			</UserLoader>
		</div>
	</section>
	<section class="my-6 p-4 bg-base-100 rounded">
		<h3 class="text-lg py-2 text-base font-thin">Note</h3>
		<hr />
		<div class="my-4">
			<TextareaField placeholder="Write order note" />
		</div>
	</section>
	<!-- <section class="my-6 p-4 bg-base-100 rounded">

	</section> -->
</div>

<style>
	th {
		padding: 8px 4px;
	}
	td {
		padding: 4px;
	}
</style>
