import { openDialog } from "@cloudparker/moldex.js";
import type { SkuDataModel } from "./sku-types";
import SkuEditDialog from "./components/sku-edit-dialog.svelte";
import { isMobileScreen } from "@cloudparker/moldex.js";
import { openDeleteConfirmDialog } from "@cloudparker/moldex.js";
import { openLoadingDialog } from "@cloudparker/moldex.js";
import { deleteSku } from "./sku-service";
import { showSuccessToast } from "@cloudparker/moldex.js";
import { showErrorToast } from "@cloudparker/moldex.js";

export async function openSkuEditDialog(sku?: SkuDataModel) {
    let res = openDialog({
        bodyComponent: SkuEditDialog,
        props: { sku },
        hasTitle: true,
        hasHeader: true,
        title: 'Create sku',
        hasHeaderBack: isMobileScreen(),
        hasHeaderClose: !isMobileScreen(),
        size: isMobileScreen() ? 'full' : 'sm',
        hasFooter: true,
        hasFooterCloseButton: true,
        hasFooterOkButton: true,
        footerOkButtonLable: 'Save',
        targetFormId: 'sku-edit-form'
    });
    return res;
}

export async function openSkuDeleteDialog(sku: SkuDataModel) {

    if (sku && sku._id && (await openDeleteConfirmDialog({}))) {
        let loading = await openLoadingDialog({});
        try {
            await deleteSku(sku._id!);
            showSuccessToast();
        } catch (error) {
            console.error('Error on delete sku.');
            console.error(error);
            showErrorToast();
        }
        loading.closeDialog();
        return sku;
    }
}