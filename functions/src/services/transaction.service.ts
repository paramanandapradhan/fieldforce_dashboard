import * as admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { PaymentDataModel, TransactionDataModel, TransactionTypeEnum } from "../types/types";

export const getTransactionCollectionPath = (oid: string) => {
    return `/a/${process.env.VITE_APP_ID}/o/${oid}/txns`;
}

export const getTransactionDocumentPath = (oid: string, tid: string) => {
    return `/a/${process.env.VITE_APP_ID}/o/${oid}/txns/${tid}`;
}

export async function createTransaction({ payment }: { payment: PaymentDataModel }) {
    if (payment) {
        let payload: TransactionDataModel = {};
        payload.cat = admin.firestore.FieldValue.serverTimestamp();
        payload.uat = admin.firestore.FieldValue.serverTimestamp();
        payload.cby = payment.cby;
        payload.uby = payment.uby;
        payload.type = TransactionTypeEnum.PAYMENT;
        payload.amount = payment.amount;
        payload.date = payment.date;
        payload.source = payment._id;
        payload.oid = payment.oid;

        if (payload.oid) {
            const doc = await getFirestore().collection(getTransactionCollectionPath(payload.oid))
                .add(payload);
            console.log('createTxnDoc success', 'tid: ', doc.id);
            return doc;
        }
    }

    return null;
}