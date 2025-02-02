import { isMobileScreen, openDialog } from "@cloudparker/moldex.js";
import type { PaymentDataModel } from "./payment-types";
import PaymentEditDialog from "./components/payment-edit-dialog.svelte";

export async function openPaymentEditDialog(payment?: PaymentDataModel) {
    let res = await openDialog<PaymentDataModel>({
        bodyComponent: PaymentEditDialog,
        props: { payment },
        scrollable: false,
        hasHeader: true,
        hasFooter: true,
        hasTitle: true,
        hasHeaderBack: isMobileScreen(),
        hasHeaderClose: !isMobileScreen(),
        title:'Create Payment',
        hasFooterOkButton: true,
        hasFooterCloseButton: true,
        targetFormId: 'payment-edit-form'
    });

    return res;

}