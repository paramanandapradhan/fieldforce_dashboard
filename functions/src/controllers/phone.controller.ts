

import { onDocumentWritten } from 'firebase-functions/firestore';
import { PhoneDataModel } from '../types/types';
import { createOrgServiceAccountIdToken } from '../services/auth.service';
import { updateKV } from '../services/kv.service';

export const onPhoneWrite = onDocumentWritten(`/a/${process.env.VITE_APP_ID}/o/{oid}/phones/{pid}`,
    async (event) => {
        const oldPhone: PhoneDataModel = event.data?.before.data() || {};
        let newPhone: PhoneDataModel = event.data?.after.data() || {};

        // const pid: string = event.params.pid;
        // const oid: string = event.params.oid;

        console.log('newPhone', JSON.stringify(newPhone));

        if (!oldPhone && newPhone) {
            if (newPhone.oid && newPhone.voiceRate && newPhone._id) {
                // let amount = newPhone.vRate
                // await createRental({ oid: oid, amount, source: newPhone._id })
            }

        }

        // Update token and phone id in plivo application callbacks
        if (newPhone.oid && (newPhone?.tokenVersion || 0) > (oldPhone?.tokenVersion || 0)) {
            console.log('Update token in plivo ' + newPhone.number);
            let serviceToken = await createOrgServiceAccountIdToken(newPhone.oid);
            if (serviceToken) {
                // console.log('Got Service account token ');
                let value = {
                    phone: newPhone,
                    token: serviceToken,
                }
                let key = `PHONE-${newPhone.number}`;
                await updateKV(key, value, serviceToken);
                // await updatePhoneTokenInPlivoApplication(newPhone, serviceToken);
            }
        }

        console.log('Phone updated success.')
    });