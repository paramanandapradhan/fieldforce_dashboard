
import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import type { UserDataModel } from '../types/types';
import { getOrCreateAuthUserByEmail, getOrCreateAuthUserByPhone, updateAuthClaimByEmailUid, updateAuthClaimByPhoneUid, } from '../services/auth.service';
import { updateUser } from '../services/user.service';
import { updateFile } from '../services/file.service';
import { getDateIncrement } from '../utils/utils';

export const onUserWrite = onDocumentWritten(`/a/${process.env.VITE_APP_ID}/o/{oid}/users/{uid}`,
    async (event) => {
        const oldUser: UserDataModel = event.data?.before.data() || {};
        let newUser: UserDataModel = event.data?.after.data() || {};
        const uid: string = event.params.uid;
        const oid: string = event.params.oid;

        console.log('newUser', JSON.stringify(newUser));

        let canUpdateClaim = false;
        {
            let email: string = (newUser.email != oldUser.email) ? newUser.email! : '';
            let phone: string = (newUser.phone != oldUser.phone) ? newUser.phone! : '';

            let [emailAuthUser, phoneAuthUser] = await Promise.all([getOrCreateAuthUserByEmail({ email: email }), getOrCreateAuthUserByPhone({ phoneNumber: phone })]);

            let _eauid = (emailAuthUser || {}).uid;
            let _pauid = (phoneAuthUser || {}).uid;



            if ((_eauid && newUser._eauid != _eauid) || (_pauid && newUser._pauid != _pauid)) {
                console.log(`User updateble data `, { _eauid, _pauid });
                let payload: any = {};
                if (_eauid) {
                    payload._eauid = _eauid;

                }
                if (_pauid) {
                    payload._pauid = _pauid;
                }
                await updateUser({ oid, uid, payload });
                newUser = { ...newUser, _eauid, _pauid }
                canUpdateClaim = true;
            }
            if (oldUser.rid != newUser.rid) {
                canUpdateClaim = true;
                console.log(`User ${uid} role changed ${oldUser.rid} => ${newUser.rid}`);
            }
        }

        if (canUpdateClaim) {
            // Update Custom Claims
            let tasks = [];

            // Update new user/email claims
            if (newUser._eauid && (newUser._eauid != oldUser._eauid || newUser.rid != oldUser.rid)) {
                tasks.push(updateAuthClaimByEmailUid(newUser._eauid!));
            }

            // Update new user/phone claims
            if (newUser._pauid && (newUser._pauid != oldUser._pauid || newUser.rid != oldUser.rid)) {
                tasks.push(updateAuthClaimByPhoneUid(newUser._pauid!));
            }

            // Update old user/email claim
            if (oldUser._eauid && oldUser._eauid != newUser._eauid) {
                tasks.push(updateAuthClaimByEmailUid(oldUser._eauid));
            }

            // Update old user/phone claim
            if (oldUser._pauid && oldUser._pauid != newUser._pauid) {
                tasks.push(updateAuthClaimByPhoneUid(oldUser._pauid));
            }

            await Promise.all(tasks);
        }

        if (oldUser.photo && oldUser.photo !== newUser.photo) {
            await updateFile({ oid, fid: oldUser.photo, payload: { isDel: true, ttl: getDateIncrement(parseInt(process.env.VITE_TTL_DAYS || '1')) } });
            console.log('Photo changed old photo removed');
        }

        console.log('User create/updated claims done.')
    });