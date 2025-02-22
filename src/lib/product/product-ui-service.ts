import {
	DialogSizeEnum,
	getDialogSize,
	isMobileScreen,
	openDeleteConfirmDialog,
	openDialog,
	openLoadingDialog,
	showErrorToast,
	showSuccessToast,
	showToast
} from '@cloudparker/moldex.js';
import ProductEditDialog from './components/product-edit-dialog.svelte';
import type { ProductDataModel } from './product-type';
import { ADMIN_USER_ID } from '$lib/core/services/app-service';
import { deleteProduct, syncProducts } from './product-service';
import ProductListDialog from './components/product-list-dialog.svelte';

export async function openProductEditDialog(product?: ProductDataModel) {
	let res = openDialog({
		bodyComponent: ProductEditDialog,
		props: { product },
		hasTitle: true,
		hasHeader: true,
		title: product?._id ? 'Edit Product' : 'Add Product',
		hasHeaderBack: isMobileScreen(),
		hasHeaderClose: !isMobileScreen(),
		size: DialogSizeEnum.FULL,
		hasFooter: true,
		hasFooterCloseButton: true,
		hasFooterOkButton: true,
		footerOkButtonLable: 'Save',
		targetFormId: 'product-edit-form'
	});
	return res;
}

export async function openProductDeleteDialog(product: ProductDataModel) {
	if (product._id == ADMIN_USER_ID) {
		showToast({ msg: 'Can not delete the main Admin Staff!' });
		return;
	}
	if (product && product._id && (await openDeleteConfirmDialog({}))) {
		let loading = await openLoadingDialog({});
		try {
			await deleteProduct(product._id!);
			await syncProducts();
			showSuccessToast();
		} catch (error) {
			console.error('Error on delete Product.');
			console.error(error);
			showErrorToast();
		}
		loading.closeDialog();
		return product;
	}
}




export async function openProductListDialog() {
	let res = openDialog({
		bodyComponent: ProductListDialog,
		props: {},
		hasTitle: true,
		hasHeader: true,
		title: ' Order',
		hasHeaderBack: isMobileScreen(),
		hasHeaderClose: !isMobileScreen(),
		size: getDialogSize(),
		hasFooter: true,
		hasFooterCloseButton: true,
		hasFooterOkButton: true,
		footerOkButtonLable: 'Save',
	});
	return res;
}
