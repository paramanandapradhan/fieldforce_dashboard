import { isMobileScreen, openDialog } from "@cloudparker/moldex.js";
import type { InvoiceDataModel } from "./invoice-types";
import InvoiceEditDialog from "./components/invoice-edit-dialog.svelte";


export async function openInvoiceEditDialog(invoice?: InvoiceDataModel) {
    let res = await openDialog<InvoiceDataModel>({
        bodyComponent: InvoiceEditDialog,
        props: { invoice },
        scrollable: false,
        hasHeader: true,
        hasFooter: true,
        hasTitle: true,
        hasHeaderBack: isMobileScreen(),
        hasHeaderClose: !isMobileScreen(),
        title:'Create Invoice',
        hasFooterOkButton: true,
        hasFooterCloseButton: true,
        targetFormId: 'invoice-edit-form'
    });

    return res;

}