import { getFirestore } from "firebase-admin/firestore";
import { RoleDataModel, UserDataModel } from "../types/types";
import * as admin from 'firebase-admin';

export const getRolesCollectionPath = (oid: string) => {
    return `/a/${process.env.VITE_APP_ID}/o/${oid}/roles`;
}

export const getRolesDocumentPath = (oid: string, rid: string) => {
    return `/a/${process.env.VITE_APP_ID}/o/${oid}/roles/${rid}`;
}

export const getRole = async ({ oid, rid, }: { oid: string, rid: string }): Promise<RoleDataModel | null> => {
    let snapshot = await getFirestore().doc(getRolesDocumentPath(oid, rid)).get();
    if (snapshot.exists) {
        let role: UserDataModel = snapshot.data()!;
        role._id = snapshot.id;
        return role;
    }
    return null;
}


export const createRole = async ({ oid, id, payload }: { oid: string, id: string, payload: RoleDataModel }) => {
    payload.cat = admin.firestore.FieldValue.serverTimestamp();
    payload.uat = admin.firestore.FieldValue.serverTimestamp();
    await getFirestore().doc(getRolesDocumentPath(oid, id))
        .set(payload, { merge: true });
    console.log('createRoleDoc success', 'uid: ', id);
}




