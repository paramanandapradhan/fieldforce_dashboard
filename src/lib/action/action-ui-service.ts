import {
	isMobileScreen,
	openDeleteConfirmDialog,
	openDialog,
	openLoadingDialog,
	showErrorToast,
	showSuccessToast
} from '@cloudparker/moldex.js';
import type { ActionDataModel } from './action-types';
import ActionEditDialog from './components/action-edit-dialog.svelte';
import { deleteAction, syncActions } from './action-service';

export async function openActionEditDialog({
	agentId,
	action
}: {
	agentId: string | undefined;
	action?: ActionDataModel;
}) {
	let res = openDialog({
		bodyComponent: ActionEditDialog,
		props: { action, agentId },
		hasTitle: true,
		hasHeader: true,
		title: 'Create Action',
		hasHeaderBack: isMobileScreen(),
		hasHeaderClose: !isMobileScreen(),
		size: isMobileScreen() ? 'full' : 'sm',
		hasFooter: true,
		hasFooterCloseButton: true,
		hasFooterOkButton: true,
		footerOkButtonLable: 'Save',
		targetFormId: 'action-edit-form',
		className:'h-[500px] w-[500px]'
		
	});
	return res;
}

export async function openActionDeleteDialog(action: ActionDataModel) {
	if (action?._id && (await openDeleteConfirmDialog({}))) {
		let loading = await openLoadingDialog({});
		try {
			await deleteAction(action._id!);
			await syncActions();
			showSuccessToast();
		} catch (error) {
			console.error('Error on delete knowledge.');
			console.error(error);
			showErrorToast();
		}
		loading.closeDialog();
		return action;
	}
}
