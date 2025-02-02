
import { FieldValue } from 'firebase-admin/firestore';
import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import { ADMIN_ROLE_ID, ADMIN_USER_ID, ROOT_ORG_ID, SERVICE_ROLE_ID, SERVICE_USER_ID, SUPPORT_ROLE_ID, SUPPORT_USER_ID } from '../services/common.service';
import { createRole } from '../services/role.service';
import { createRtdbNumberId } from '../services/rtdb-service';
import { createUser, updateUser } from '../services/user.service';
import { OrgDataModel, RoleDataModel, UserDataModel } from '../types/types';
import { isEmpty } from '../utils/utils';
import { getServiceAccountEmail, getSupportAccountEmail } from '../services/auth.service';


export const onOrgWrite =
    onDocumentWritten(`/a/${process.env.VITE_APP_ID}/o/{oid}`,
        async (event) => {
            try {
                console.log(`--------------${event.params.oid} - onOrgWrite Start-------------`);
                const oid = event.params.oid;
                const oldOrg: OrgDataModel = event.data?.before.data() || {};
                const newOrg: OrgDataModel = event.data?.after.data() || {};
                console.log('oldOrg', oldOrg);
                console.log('newOrg', newOrg);
                if (isEmpty(oldOrg)) {
                    let uid = '1';
                    let rid = '1';
                    console.log('Roles id incremented, rid = ' + rid);
                    console.log('User id incremented, uid = ' + uid);
                    if (uid == ADMIN_USER_ID && rid == ADMIN_ROLE_ID) {
                        console.log('Now, need to create role and an Owner user for org = ' + oid);
                        if (newOrg.ownerName && (newOrg.ownerEmail || newOrg.ownerPhone)) {

                            let adminUserPayload: UserDataModel = {
                                oid,
                                name: newOrg.ownerName || '',
                                desc: 'This user is the owner and administrator of your business or organization, with full control over the app.',
                                email: newOrg.ownerEmail || null,
                                phone: newOrg.ownerPhone || null,
                                rid: ADMIN_ROLE_ID,
                                cby: SERVICE_USER_ID,
                                uby: SERVICE_USER_ID,
                                cat: FieldValue.serverTimestamp(),
                                uat: FieldValue.serverTimestamp(),
                                default: true,
                            }
                            if (oid == ROOT_ORG_ID && uid == ADMIN_USER_ID) {
                                adminUserPayload.ur = true;
                            }

                            let serviceUserPayload: UserDataModel = {
                                oid,
                                name: 'Service Acount',
                                desc: 'This service account will be used for communication between internal services of Hellocall.ai.',
                                email: getServiceAccountEmail(oid),
                                rid: SERVICE_ROLE_ID,
                                cby: SERVICE_USER_ID,
                                uby: SERVICE_USER_ID,
                                cat: FieldValue.serverTimestamp(),
                                uat: FieldValue.serverTimestamp(),
                                default: true,
                            }

                            let supportUserPayload: UserDataModel = {
                                oid,
                                name: 'Support User',
                                desc: 'This support user will be a dedicated resource for the account, providing assistance with technical issues.',
                                email: getSupportAccountEmail(oid),
                                rid: SUPPORT_ROLE_ID,
                                cby: SERVICE_USER_ID,
                                uby: SERVICE_USER_ID,
                                cat: FieldValue.serverTimestamp(),
                                uat: FieldValue.serverTimestamp(),
                                default: true,
                            }

                            let adminRolePayload: RoleDataModel = {
                                oid,
                                name: 'Admin Role',
                                desc: 'The Admin role has complete access to all organizational data.',
                                scp: {},
                                cat: FieldValue.serverTimestamp(),
                                uat: FieldValue.serverTimestamp(),
                                cby: SERVICE_USER_ID,
                                uby: SERVICE_USER_ID,
                                default: true,
                            }

                            let supportRolePayload: RoleDataModel = {
                                oid,
                                name: 'Support Role',
                                desc: 'Users with the Support User Role can perform support-related activities.',
                                scp: {},
                                cat: FieldValue.serverTimestamp(),
                                uat: FieldValue.serverTimestamp(),
                                cby: SERVICE_USER_ID,
                                uby: SERVICE_USER_ID,
                                default: true,
                            }

                            let serviceAccountRolePayload: RoleDataModel = {
                                oid,
                                name: 'Service Account Role',
                                desc: 'The Service Account Role is designed for facilitating service-to-service communication.',
                                scp: {},
                                cat: FieldValue.serverTimestamp(),
                                uat: FieldValue.serverTimestamp(),
                                cby: SERVICE_USER_ID,
                                uby: SERVICE_USER_ID,
                                default: true,
                            }

                            await Promise.all([
                                createRole({ oid, id: ADMIN_ROLE_ID, payload: adminRolePayload }),
                                createRole({ oid, id: SERVICE_ROLE_ID, payload: serviceAccountRolePayload }),
                                createRole({ oid, id: SUPPORT_ROLE_ID, payload: supportRolePayload }),

                                createUser({ oid, id: ADMIN_USER_ID, payload: adminUserPayload }),
                                createUser({ oid, id: SERVICE_USER_ID, payload: serviceUserPayload }),
                                createUser({ oid, id: SUPPORT_USER_ID, payload: supportUserPayload }),

                                createRtdbNumberId({ org: oid, key: 'users', startValue: 3 }),
                                createRtdbNumberId({ org: oid, key: 'roles', startValue: 3 }),

                            ]);

                            console.log('First owner user created');
                        }
                    }
                } else if (oldOrg.ownerName != newOrg.ownerName || oldOrg.ownerEmail != newOrg.ownerEmail || oldOrg.ownerPhone != newOrg.ownerPhone) {
                    /**
                     * Update the owner user with new phone or email. 
                     */
                    let payload: any = { oid, name: newOrg.ownerName || '', email: newOrg.ownerEmail || null, phone: newOrg.ownerPhone || null, rid: ADMIN_ROLE_ID };
                    await updateUser({ oid, uid: ADMIN_USER_ID, payload });
                    console.log('Updated First owner user ');
                }
                console.log('Firebase Org create/update success');
            } catch (error) {
                console.error(error);
            }
            console.log(`--------------${event.params.oid} : onOrgWrite End-------------`);
        });




