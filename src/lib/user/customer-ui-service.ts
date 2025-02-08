import { DialogSizeEnum, getDialogSize, isMobileScreen, openDeleteConfirmDialog, openDialog, openLoadingDialog, showErrorToast, showSuccessToast } from "@cloudparker/moldex.js";

import CustomerEditDialog from "./components/customer-edit-dialog.svelte";
import type { CustomerDataModel } from "$lib/user/user-types";
import { deleteUser, syncUsers } from "$lib/user/user-service";

export async function openCustomerEditDialog(customer?: CustomerDataModel) {
    let res = openDialog({
        bodyComponent: CustomerEditDialog,
        props: { customer },
        hasTitle: true,
        hasHeader: true,
        title: 'Create customer',
        hasHeaderBack: isMobileScreen(),
        hasHeaderClose: !isMobileScreen(),
        size: DialogSizeEnum.FULL,
        hasFooter: true,
        hasFooterCloseButton: true,
        hasFooterOkButton: true,
        footerOkButtonLable: 'Save',
        targetFormId: 'customer-edit-form'
    });
    return res;
}

export async function openCustomerDeleteDialog(customer: CustomerDataModel) {

    if (customer && customer._id && (await openDeleteConfirmDialog({}))) {
        let loading = await openLoadingDialog({});
        try {
            await deleteUser(customer._id!);
            await syncUsers();
            showSuccessToast();
        } catch (error) {
            console.error('Error on delete customer.');
            console.error(error);
            showErrorToast();
        }
        loading.closeDialog();
        return customer;
    }
}
