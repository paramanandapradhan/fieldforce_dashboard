<script lang="ts">
	import { AttributeTypeEnum } from '$lib/attribute/attribute-service';
	import AttributeComboboxField from '$lib/attribute/components/attribute-combobox-field.svelte';
	import { addToCart, clearCart, getCartItems } from '$lib/cart/cart-service';
	import type { CartDataModel } from '$lib/cart/cart-types';
	import ButtonIncrement from '$lib/core/components/button-increment.svelte';
	import {
		mdiAccount,
		mdiCartRemove,
		mdiCloseCircleOutline
	} from '$lib/core/services/app-icons-service';
	import { createOrder, syncOrders } from '$lib/order/order-service';
	import type { OrderDataModel } from '$lib/order/order-type';
	import { getAllProducts, syncProducts } from '$lib/product/product-service';

	import type { ProductDataModel } from '$lib/product/product-type';
	import TextUser from '$lib/user/components/text-user.svelte';
	import UserLoader from '$lib/user/components/user-loader.svelte';
	import type { CustomerDataModel } from '$lib/user/user-types';
	import {
		Button,
		DialogSizeEnum,
		Icon,
		openConfirmDialog,
		openDeleteConfirmDialog,
		openLoadingDialog,
		showToast,
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

	let { customerId, setFooterSnippet, closeDialog }: DialogExports & Props = $props();

	let cartItems: CartDataModel[] = $state([]);

	let products: ProductDataModel[] = $state([]);

	let productQuantityMap: QuantityMap = $state({});
	let productMap: ProductMap = $state({});
	let customer: CustomerDataModel | null = $state(null);

	let orderType: string = $state('');
	let paymentMode: string = $state('');
	let note: string = $state('');

	let isPlacingOrder: boolean = $state(false);

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

	async function handleClearCart() {
		if (
			await openDeleteConfirmDialog({
				msg: 'Are you sure to delete all items from Cart?',
				title: 'Clear Cart',
				footerOkButtonLable: 'Clear Cart'
			})
		) {
			await clearCart(customerId);
			closeDialog();
		}
	}

	async function handlePlaceOrder() {
		if (
			!isPlacingOrder &&
			(await openConfirmDialog({
				msg: 'Are you sure to place the order now?',
				title: 'Order',
				footerOkButtonLable: 'Place Order',
				size: DialogSizeEnum.SM
			}))
		) {
			isPlacingOrder = true;
			let loader = await openLoadingDialog({ msg: 'Placing Order...', size: DialogSizeEnum.SM });
			try {
				let sellerOrderMap = await prepareSellerOrders();
				let orders = Object.keys(sellerOrderMap).map(async (sellerId) => {
					let items: CartDataModel[] = sellerOrderMap[sellerId];
					if (items?.length) {
						let amount: number = items.reduce((acc, item) => {
							acc += (item.quantity || 1) * (item.salePrice || 0);
							return acc;
						}, 0);
						let payload: OrderDataModel = {
							customer: customerId,
							seller: sellerId,
							items,
							note,
							paymentMode,
							orderType,
							amount,
							date: new Date()
						};
						await createOrder(payload);
					}
				});
				await Promise.all(orders);
				await showToast({ msg: 'Order success!' });
				await clearCart(customerId);
				await syncOrders();
				await closeDialog(true);
			} catch (error) {
				console.error(error);
				await showToast({ msg: `Unable to place order now!` });
			}
			await loader.closeDialog();
			isPlacingOrder = false;
		}
	}

	async function prepareSellerOrders() {
		await syncProducts();
		await loadProducts();
		await loadCartItems();

		let sellerOrderMap: any = {};
		cartItems.forEach((item: CartDataModel) => {
			if (item.product) {
				let product = productMap[item.product];
				if (product) {
					let orderList: any[] = sellerOrderMap[product.seller || ''];
					if (!orderList) {
						orderList = [];
						sellerOrderMap[product.seller || ''] = orderList;
					}
					orderList.push({
						product: item.product,
						quantity: item.quantity || 1,
						salePrice: product.salePrice || 0,
						seller: product.seller
					});
				}
			}
		});

		return sellerOrderMap;
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
			<div class="text-base-400 dark:text-base-500 text-sm">Payble</div>
			<div class="font-bold text-sm text-base dark:text-base-400">
				<TextCurrency input={totalAmount} hasSymbol symbol="₹" />
			</div>
		</div>
		<Button
			appearance="primary"
			className="px-8"
			onClick={handlePlaceOrder}
			disabled={!totalQuantity || isPlacingOrder}
			spinner={isPlacingOrder}
		>
			<div>Place Order</div>
		</Button>
	</div>
{/snippet}

<div class="px-4">
	<section>
		<div>
			<h2 class="text-lg font-thin dark:text-base-300">Items</h2>
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
	<section class="flex justify-end pt-6 mt-6 b dark:text-base-300 text-xl text-base ml-36 gap-6">
		<div>Total :</div>
		<div>
			<TextCurrency input={totalAmount} hasSymbol symbol="₹" />
		</div>
	</section>
	<section class="my-6 mt-12 p-4 bg-base-100 dark:bg-base-700 rounded">
		<h3 class="text-lg py-2 text-base dark:text-base-300 font-thin">Delivery Details</h3>
		<hr />
		<div class="my-4">
			<div class="font-bold dark:text-base-200">
				<TextUser input={customerId} hideIcon hideDropdown></TextUser>
			</div>
			<UserLoader userId={customerId} bind:user={customer}>
				{#if customer}
					<div>
						<span class="text-base dark:text-base-400"> Phone : </span>
						<span class="dark:text-base-300">
							{customer.delivery?.phone || ''}
						</span>
					</div>
					<div>
						<span class="text-base dark:text-base-400">Email :</span>
						<span class="dark:text-base-300">{customer.delivery?.email || ''}</span>
					</div>
					<div>
						<div class="text-base dark:text-base-400">Address:</div>
						<div class="dark:text-base-300">
							<address>
								{customer.delivery?.address || ''}
							</address>
						</div>
					</div>
				{/if}
			</UserLoader>
		</div>
	</section>

	<section class="my-6 p-4 bg-base-100 dark:bg-base-700 rounded">
		<h3 class="text-lg py-2 text-base dark:text-base-300 font-thin">Note</h3>
		<hr class="border-base" />
		<div class="my-4">
			<AttributeComboboxField
				bind:value={orderType}
				name="orderType"
				label="Order Type"
				attributeType={AttributeTypeEnum.ORDER_TYPE}
			/>
		</div>
		<div class="my-4">
			<AttributeComboboxField
				bind:value={paymentMode}
				name="paymentMode"
				label="Payment Mode"
				attributeType={AttributeTypeEnum.PAYMENT_MODE}
			/>
		</div>
		<div class="my-4">
			<TextareaField
				bind:value={note}
				label="Note"
				placeholder="Write order note"
				maxlength={300}
			/>
		</div>
	</section>

	<section class="py-8">
		<div class="flex justify-center">
			<Button appearance="border" className="px-12" onClick={handleClearCart}>
				<div><Icon path={mdiCartRemove}></Icon></div>
				<div>Clear Cart</div>
			</Button>
		</div>
	</section>
</div>

<style>
	th {
		padding: 8px 4px;
	}
	td {
		padding: 4px;
	}
</style>
