import {
	isMobileScreen,
	openDeleteConfirmDialog,
	openDialog,
	openLoadingDialog,
	openPickerDialog,
	showErrorToast,
	showSuccessToast
} from '@cloudparker/moldex.js';
import CallEditDialog from './components/call-edit-dialog.svelte';
import type { CallDataModel } from './call-types';
import { deleteCall, syncCalls } from './call-service';
import { getAllAgents } from '$lib/agent/services/agent-service';
import type { AgentDataModel } from '$lib/agent/types/agent-types';
 
export async function openCallEditDialog(call?: CallDataModel) {
	let res = openDialog({
		bodyComponent: CallEditDialog,
		props: { call },
		hasTitle: true,
		hasHeader: true,
		title: 'Create call',
		hasHeaderBack: isMobileScreen(),
		hasHeaderClose: !isMobileScreen(),
		size: isMobileScreen() ? 'full' : 'sm',
		hasFooter: true,
		hasFooterCloseButton: true,
		hasFooterOkButton: true,
		footerOkButtonLable: 'Save',
		targetFormId: 'call-edit-form'
	});
	return res;
}

export async function openCallDeleteDialog(call: CallDataModel) {
	if (call && call._id && (await openDeleteConfirmDialog({}))) {
		let loading = await openLoadingDialog({});
		try {
			await deleteCall(call._id!);
			await syncCalls();
			showSuccessToast();
		} catch (error) {
			console.error('Error on delete call.');
			console.error(error);
			showErrorToast();
		}
		loading.closeDialog();
		return call;
	}
}
 