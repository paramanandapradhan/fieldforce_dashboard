import { getDialogSize, isMobileScreen, openDeleteConfirmDialog, openDialog, openLoadingDialog, showErrorToast, showSuccessToast } from "@cloudparker/moldex.js";
import type { RetailerDataModel } from "./retailer-types";
import { deleteRetailer, syncRetailers } from "./retailer-service";
import RetailerEditDialog from "./components/retailer-edit-dialog.svelte";

export async function openRetailerEditDialog(retailer?: RetailerDataModel) {
    let res = openDialog({
        bodyComponent: RetailerEditDialog,
        props: { retailer },
        hasTitle: true,
        hasHeader: true,
        title: 'Create retailer',
        hasHeaderBack: isMobileScreen(),
        hasHeaderClose: !isMobileScreen(),
        size: getDialogSize(),
        hasFooter: true,
        hasFooterCloseButton: true,
        hasFooterOkButton: true,
        footerOkButtonLable: 'Save',
        targetFormId: 'retailer-edit-form'
    });
    return res;
}

export async function openRetailerDeleteDialog(retailer: RetailerDataModel) {

    if (retailer && retailer._id && (await openDeleteConfirmDialog({}))) {
        let loading = await openLoadingDialog({});
        try {
            await deleteRetailer(retailer._id!);
            await syncRetailers();
            showSuccessToast();
        } catch (error) {
            console.error('Error on delete retailer.');
            console.error(error);
            showErrorToast();
        }
        loading.closeDialog();
        return retailer;
    }
}
