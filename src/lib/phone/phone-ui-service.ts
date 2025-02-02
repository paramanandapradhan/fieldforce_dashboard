import {
	isMobileScreen,
	openDeleteConfirmDialog,
	openDialog,
	openLoadingDialog,
	openPickerDialog,
	showErrorToast,
	showSuccessToast
} from '@cloudparker/moldex.js';
import PhoneEditDialog from './components/phone-edit-dialog.svelte';
import type { PhoneDataModel } from './phone-types';
import { deletePhone, syncPhones } from './phone-service';
import { getAllAgents } from '$lib/agent/services/agent-service';
import type { AgentDataModel } from '$lib/agent/types/agent-types';
import PhoneDetailsDialog from './components/phone-details-dialog.svelte';

export async function openPhoneEditDialog(phone?: PhoneDataModel) {
	let res = openDialog({
		bodyComponent: PhoneEditDialog,
		props: { phone },
		hasTitle: true,
		hasHeader: true,
		title: 'Create phone',
		hasHeaderBack: isMobileScreen(),
		hasHeaderClose: !isMobileScreen(),
		size: isMobileScreen() ? 'full' : 'sm',
		hasFooter: true,
		hasFooterCloseButton: true,
		hasFooterOkButton: true,
		footerOkButtonLable: 'Save',
		targetFormId: 'phone-edit-form'
	});
	return res;
}

export async function openPhoneDeleteDialog(phone: PhoneDataModel) {
	if (phone && phone.number && (await openDeleteConfirmDialog({}))) {
		let loading = await openLoadingDialog({});
		try {
			await deletePhone(phone.number);
			await syncPhones();
			showSuccessToast();
		} catch (error) {
			console.error('Error on delete phone.');
			console.error(error);
			showErrorToast();
		}
		loading.closeDialog();
		return phone;
	}
}

export async function openAgentPickerDialog({
	agents,
	multiple,
	value,
	maxlength
}: {
	agents: AgentDataModel[];
	multiple?: boolean;
	value?: string;
	maxlength?: number;
}) {
	let items = agents || (await getAllAgents());
	let res = await openPickerDialog<string>({
		items,
		value,
		multiple,
		maxlength,
		hasHeader: true,
		hasHeaderBack: isMobileScreen(),
		hasHeaderClose: !isMobileScreen(),
		hasTitle: true,
		hasFooter: multiple,
		hasFooterCloseButton: multiple,
		hasFooterOkButton: multiple,
		footerOkButtonLable: 'Select',
		title: `Pick an Agent`
	});
	return res;
}


export async function openPhoneDetailsDialog(phoneId: string) {
    let res = await openDialog({
        bodyComponent: PhoneDetailsDialog,
        props: {
            phoneId
        },
        hasHeader: true,
        hasHeaderBack: isMobileScreen(),
        hasHeaderClose: !isMobileScreen(),
        hasTitle: true,
        title: 'Phone',
    });

    return res;
}