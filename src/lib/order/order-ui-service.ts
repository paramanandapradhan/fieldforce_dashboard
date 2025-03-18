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
import OrderEditDialog from './components/order-edit-dialog.svelte';
import type { OrderDataModel } from './order-type';
import { ADMIN_USER_ID } from '$lib/core/services/app-service';
import { deleteOrder, syncOrders } from './order-service';
import OrderDetailsDialog from './components/order-details-dialog.svelte';
import OrderBasicDetailsDialog from './components/order-basic-details-dialog.svelte';

export async function openOrderEditDialog(order?: OrderDataModel) {
	let res = openDialog({
		bodyComponent: OrderEditDialog,
		props: { order },
		hasTitle: true,
		hasHeader: true,
		title: order?._id ? 'Edit Order' : 'Add Order',
		hasHeaderBack: isMobileScreen(),
		hasHeaderClose: !isMobileScreen(),
		size: getDialogSize(),
		hasFooter: true,
		hasFooterCloseButton: true,
		hasFooterOkButton: true,
		footerOkButtonLable: 'Save',
		targetFormId: 'order-edit-form'
	});
	return res;
}

export async function openOrderDeleteDialog(order: OrderDataModel) {
	if (order._id == ADMIN_USER_ID) {
		showToast({ msg: 'Can not delete the main Admin Staff!' });
		return;
	}
	if (order && order._id && (await openDeleteConfirmDialog({}))) {
		let loading = await openLoadingDialog({});
		try {
			await deleteOrder(order._id!);
			await syncOrders();
			showSuccessToast();
		} catch (error) {
			console.error('Error on delete Order.');
			console.error(error);
			showErrorToast();
		}
		loading.closeDialog();
		return order;
	}
}

export async function openOrderDetailsDialog(orderId?: string) {
	let res = openDialog({
		bodyComponent: OrderDetailsDialog,
		props: { orderId },
		hasTitle: true,
		hasHeader: true,
		title: 'Order Details',
		hasHeaderBack: isMobileScreen(),
		hasHeaderClose: !isMobileScreen(),
		size: isMobileScreen() ? DialogSizeEnum.FULL : DialogSizeEnum.LG,
		hasFooter: true,
		hasFooterCloseButton: true,
	});
	return res;
}

export async function openOrderBasicDetailsDialog(orderId: string) {
    let res = await openDialog({
        bodyComponent: OrderBasicDetailsDialog,
        props: {
            orderId
        },
        hasHeader: true,
        hasHeaderBack: isMobileScreen(),
        hasHeaderClose: !isMobileScreen(),
        hasTitle: true,
        title: 'Order',
    });

    return res;
}
