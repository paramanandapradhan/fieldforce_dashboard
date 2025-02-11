<script lang="ts">
	import { onMount } from 'svelte';
	import { getAllProducts } from '../product-service';
	import type { ProductDataModel } from '../product-type';
	import { openProductDeleteDialog, openProductEditDialog } from '../product-ui-service';
	import { ButtonMenu, IconCircle, mdiDotsHorizontal, navigate, Pagination, sort } from '@cloudparker/moldex.js';
	import { mdiAccount, mdiPackageVariantClosed } from '$lib/core/services/app-icons-service';
	import { appState } from '$lib/core/services/app-state.svelte';

	let products: ProductDataModel[] = $state([]);

	let paginatedProducts: ProductDataModel[] = $state([]);
	let pageIndex: number = $state(0);
	let pageSize: number = $state(10);

    export async function loadProducts(){
       let array = await getAllProducts()
       products = sort({array, field:'name'})

    }

    async function handleMenu(ev: MouseEvent, menu: string, product: ProductDataModel) {
		switch (menu) {
			case 'Edit':
				await openProductEditDialog(product)
				await loadProducts();
				break;
			case 'Delete':
				await openProductDeleteDialog(product);
				await loadProducts();
				break;
			case 'View':
            handelViewProduct(product);
				break;
		}
	}
	function handelViewProduct(product: ProductDataModel) {
		navigate(`/restricted/products/view?productId=${product._id}`);
	}

    $effect(() => {
		const start = pageIndex * pageSize;
		const end = start + pageSize;
		paginatedProducts = products.slice(start, end);
	});

	// Handle page index changes
	function handlePageIndexChange(newPageIndex: number) {
		pageIndex = newPageIndex;
	}

	// Handle page size changes
	function handlePageSizeChange(newPageSize: number) {
		pageSize = newPageSize;
		pageIndex = 0;
	}

    onMount(() => {
        loadProducts()
    })
</script>

<div>
	<table class="min-w-full divide-y divide-base-200 table-fixed">
		<thead>
			<tr>
				<th class="text-left w-14"></th>
				<th class="text-left p-4">Name</th>
				<th class="text-left p-4">MRP</th>
				<th class="text-left p-4">Sales Price</th>
				<th class="text-right p-4"></th>
			</tr>
		</thead>
        <tbody class="divide-y divide-base-200">
            {#each paginatedProducts as product, index}
                <tr>
                    <td class="text-left pl-4 py-1 w-14">
						<IconCircle
							iconPath={mdiPackageVariantClosed}
							iconClassName="!h-5 !w-5 text-primary"
							circleClassName="!h-10 !w-10"
						/>
					</td>
                    <td class="text-left px-4">
						<div>
							<a href="/restricted/products/view?productId={product._id}" class="hover:text-primary">
								{product.name || '-'}
							</a>
						</div>
						<div class="text-sm text-base-500">{product.desc || '-'}</div>
					</td>
                    <td class="text-left px-4">{product.mrp || '-'}</td>
					<td class="text-left px-4">{product.salesPrice || '-'}</td>
                    <td class="text-left px-4">
						<div class="flex justify-end">
							<ButtonMenu
								menus={['View', 'Edit', 'Delete']}
								iconPath={mdiDotsHorizontal}
								onMenu={(ev, menu) => handleMenu(ev, menu as string, product)}
								iconClassName="text-base-400 hover:text-base-800 {appState.theme == 'light'
									? ''
									: 'dark:hover:text-base-200'}"
							/>
						</div>
					</td>
                </tr>
            {/each}
        </tbody>
	</table>
    <div class="p-4">
		<Pagination
			length={products?.length}
			{pageIndex}
			{pageSize}
			onPageSizeChange={handlePageSizeChange}
			onPageIndexChange={handlePageIndexChange}
		/>
	</div>
</div>
