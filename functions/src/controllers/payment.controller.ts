
import { onDocumentUpdated } from 'firebase-functions/v2/firestore';
import { PaymentStatusEnum, type PaymentDataModel } from '../types/types';
import { updateBalance } from '../services/payment.service';
import { createTransaction } from '../services/transaction.service';

export const onPaymentUpdate = onDocumentUpdated(`/a/${process.env.VITE_APP_ID}/o/{oid}/payments/{pid}`,
    async (event) => {
        const oldPayment: PaymentDataModel = event.data?.before.data() || {};
        let newPayment: PaymentDataModel = event.data?.after.data() || {};

        // const pid: string = event.params.pid;
        // const oid: string = event.params.oid;

        console.log('newPayment', JSON.stringify(newPayment));

        if (oldPayment.status != PaymentStatusEnum.SUCCESS && newPayment.status == PaymentStatusEnum.SUCCESS) {
            let tasks = [];
            if (newPayment.oid && newPayment.amount) {
                tasks.push(updateBalance({ oid: newPayment.oid, amount: newPayment.amount }));
            }
            tasks.push(createTransaction({ payment: newPayment }));

            await Promise.all(tasks);
        }

        console.log('Payment updated success.')
    });