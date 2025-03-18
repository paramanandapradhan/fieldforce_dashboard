import {
	dateFormat,
	DialogSizeEnum,
	downloadBlob,
	getDialogSize,
	isMobileScreen,
	openDeleteConfirmDialog,
	openDialog,
	openLoadingDialog,
	showErrorToast,
	showSuccessToast,
	showToast,
	toDate
} from '@cloudparker/moldex.js';
import OrderEditDialog from './components/order-edit-dialog.svelte';
import type { OrderDataModel } from './order-type';
import { ADMIN_USER_ID } from '$lib/core/services/app-service';
import { deleteOrder, getAllOrders, syncOrders } from './order-service';
import OrderDetailsDialog from './components/order-details-dialog.svelte';
import OrderBasicDetailsDialog from './components/order-basic-details-dialog.svelte';
import type { CartDataModel } from '$lib/cart/cart-types';
import { getAllProducts } from '$lib/product/product-service';
import { CUSTOMER_SUBTYPES, getUser, USER_SUBTYPES } from '$lib/user/user-service';
import type { CustomerDataModel } from '$lib/user/user-types';
import { getAllAttributes } from '$lib/attribute/attribute-service';

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

export async function downloadOrderSheet() {
	const XLSX = (window as any).XLSX;
	const orders = await getAllOrders();
	const products = await getAllProducts();
	const productsMap = products.reduce((acc, p) => {
		acc[p._id!] = p;
		return acc;
	}, {} as any);
	const users = await getAllProducts();
	const usersMap = users.reduce((acc, u) => {
		acc[u._id!] = u;
		return acc;
	}, {} as any);

	const attributes = await getAllAttributes();
	const attributesMap = users.reduce((acc, u) => {
		acc[u._id!] = u;
		return acc;
	}, {} as any);

	const results: any[] = [];
	let array = orders.map(async (order: OrderDataModel) => {
		let customer = await getUser(order.customer!) as CustomerDataModel;
		(order.items || []).forEach((item: CartDataModel) => {
			const orderId = order._id;
			const orderDate = dateFormat(toDate(order.cat)!, "MM-DD-YYYY hh:mm a");
			const itemId = item.product;
			const itemQuantity = item.quantity;
			const itemSalePrice = item.salePrice;
			const itemAmount = (item.quantity || 0) * (item.salePrice || 0);
			const orderAmount = order.amount || 0;
			const itemName = productsMap[itemId!]?.name || '';
			const customerId = customer._id;
			const customerName = customer.name || '';
			const customerPhone = customer.phone || '';
			const customerEmail = customer.email || '';
			const orderStatus = attributesMap[order.status || ''] || '';
			const customerSm = usersMap[customer.master?.sm || '']?.name || '';
			const customerTsm = usersMap[customer.master?.tsm!]?.name || '';
			const customerType = CUSTOMER_SUBTYPES.find((o) => o._id == customer.subtype)?.name || '';
			const customerExternalId = customer.extId || '';
			const orderBy = usersMap[order?.cby!]?.name;

			const result = {
				orderId,
				orderDate,
				itemId,
				itemName,
				itemQuantity,
				itemSalePrice,
				itemAmount,
				orderAmount,
				orderStatus,
				customerId,
				customerName,
				customerPhone,
				customerEmail,
				customerSm,
				customerTsm,
				customerType,
				customerExternalId,
				orderBy
			};

			results.push(result);

		});
	});

	await Promise.all(array);

	const ws = XLSX.utils.json_to_sheet(results);
	const wb = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(wb, ws, 'Order Sheet');

	const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
	const buf = new ArrayBuffer(wbout.length);
	const view = new Uint8Array(buf);
	for (let i = 0; i < wbout.length; i++) {
		view[i] = wbout.charCodeAt(i) & 0xff;
	}
	const blob = new Blob([buf], { type: 'application/vnd.ms-excel' });
	await downloadBlob(blob, 'Order_Sheet.xlsx');
}
