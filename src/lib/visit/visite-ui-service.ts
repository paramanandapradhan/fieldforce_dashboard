import {
	getDialogSize,
	isMobileScreen,
	openDeleteConfirmDialog,
	openDialog,
	openLoadingDialog,
	showErrorToast,
	showSuccessToast,
	showToast
} from '@cloudparker/moldex.js';
import type { VisitDataModel } from './visite-type';
import VisitEditDialog from './components/visit-edit-dialog.svelte';
import { ADMIN_USER_ID } from '$lib/core/services/app-service';
import { deleteVisit, syncVisits } from './visit-service';


export async function openVisitEditDialog(visit?: VisitDataModel) {
	let res = openDialog({
		bodyComponent: VisitEditDialog,
		props: { visit },
		hasTitle: true,
		hasHeader: true,
		title: visit?._id ? 'Edit Visit' : 'Add Visit',
		hasHeaderBack: isMobileScreen(),
		hasHeaderClose: !isMobileScreen(),
		size: getDialogSize(),
		hasFooter: true,
		hasFooterCloseButton: true,
		hasFooterOkButton: true,
		footerOkButtonLable: 'Save',
		targetFormId: 'visit-edit-form',
		scrollable: false,
	});
	return res;
}

export async function openVisitDeleteDialog(visit?: VisitDataModel) {
	if (visit?._id == ADMIN_USER_ID) {
		showToast({ msg: 'Can not delete the main Admin Staff!' });
		return;
	}
	if (visit && visit._id && (await openDeleteConfirmDialog({}))) {
		let loading = await openLoadingDialog({});
		try {
			await deleteVisit(visit._id!);
			await syncVisits();
			showSuccessToast();
		} catch (error) {
			console.error('Error on delete Team.');
			console.error(error);
			showErrorToast();
		}
		loading.closeDialog();
		return visit;
	}
}
