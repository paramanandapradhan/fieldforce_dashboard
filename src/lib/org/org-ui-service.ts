import { isMobileScreen, openDialog } from '@cloudparker/moldex.js';
import OrgEditDialog from './components/org-edit-dialog.svelte';
import type { OrgDataModel } from './org-types';
import OrgBillingAddressEditDialog from './components/org-billing-address-edit-dialog.svelte';

export async function openOrgEditDialog(org?: OrgDataModel): Promise<string> {
	let result: string = await openDialog({
		bodyComponent: OrgEditDialog,
		props: {},
		hasHeader: true,
		hasHeaderBack: isMobileScreen(),
		hasHeaderClose: !isMobileScreen(),
		hasFooter: true,
		hasFooterOkButton: true,
		hasFooterCloseButton: true,
		hasTitle: true,
		title: org?._id ? 'Edit Organization' : 'Create Organization',
		targetFormId: 'org-edit-form',
		footerOkButtonLable: 'Register Organization'
	});

	return result;
}

export async function openBillingEditDialog(org?: OrgDataModel): Promise<string> {
	let result: string = await openDialog({
		bodyComponent: OrgBillingAddressEditDialog,
		props: { org },
		hasHeader: true,
		hasHeaderBack: isMobileScreen(),
		hasHeaderClose: !isMobileScreen(),
		hasFooter: true,
		hasFooterOkButton: true,
		hasFooterCloseButton: true,
		hasTitle: true,
		cancelable:false,
        title:'Billing Information',
		targetFormId: 'billing-edit-form'
	});

	return result;
}
