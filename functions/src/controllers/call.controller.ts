
import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import { updateBalance } from '../services/payment.service';
import { CallDataModel, CallTypeEnum } from '../types/types';

export const onCallWrite = onDocumentWritten(`/a/${process.env.VITE_APP_ID}/o/{oid}/calls/{callId}`,
    async (event) => {
        const oldCall: CallDataModel = event.data?.before.data() || {};
        let newCall: CallDataModel = event.data?.after.data() || {};

        // const pid: string = event.params.pid;
        const oid: string = event.params.oid;

        console.log('newCall', JSON.stringify(newCall));

        let changeMeterValue = ((newCall || {}).meter || 0) - ((oldCall || {}).meter || 0)

        let tasks = [];

        if (changeMeterValue > 0 && oid) {
            if (newCall.type == CallTypeEnum.PHONE && newCall.pricing?.phone && newCall.pricing?.call) {
                tasks.push(updateBalance({ oid, amount: -1 * changeMeterValue * newCall.pricing?.phone }));
                tasks.push(updateBalance({ oid, amount: -1 * changeMeterValue * newCall.pricing?.call }));
            } else if (newCall.type == CallTypeEnum.CALL && newCall.pricing?.call) {
                tasks.push(updateBalance({ oid, amount: -1 * changeMeterValue * newCall.pricing?.call }));
            } else if (newCall.type == CallTypeEnum.CHAT && newCall.pricing?.chat) {
                tasks.push(updateBalance({ oid, amount: -1 * changeMeterValue * newCall.pricing?.chat }));
            }
        }

        await Promise.all(tasks);

        console.log('Payment updated success.')
    });