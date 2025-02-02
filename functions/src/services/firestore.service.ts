import { getFirestore } from "firebase-admin/firestore";
import * as admin from 'firebase-admin';

export function getCollectionPath(oid: string, collection: string) {
    return `/a/${process.env.VITE_APP_ID}/o/${oid}/${collection}`;
}

export function getDocumentPath(oid: string, collection: string, docId: string) {
    return `/a/${process.env.VITE_APP_ID}/o/${oid}/${collection}/${docId}`;
}

export async function createDoc({ oid, collection, docId, payload }: { oid: string, collection: string, docId: string, payload: any }) {
    try {
        payload.cat = admin.firestore.FieldValue.serverTimestamp();
        payload.uat = admin.firestore.FieldValue.serverTimestamp();
        await getFirestore().doc(getDocumentPath(oid, collection, docId))
            .set(payload, { merge: true });
        console.log(`createdDoc ${collection}`, docId);
    } catch (error) {
        console.error(error);
    }
}

export async function getDoc({ oid, collection, docId, }: { oid: string, collection: string, docId: string }): Promise<any | null> {
    let snapshot = await getFirestore().doc(getDocumentPath(oid, collection, docId)).get();
    if (snapshot.exists) {
        let user: any = snapshot.data()!;
        user._id = snapshot.id;
        return user;
    }
    return null;
}

export async function updateDoc({ oid, collection, docId, payload }: { oid: string, collection: string, docId: string, payload: any }) {
    try {
        payload.uat = admin.firestore.FieldValue.serverTimestamp();
        await getFirestore().doc(getDocumentPath(oid, collection, docId)).update(payload);
        console.log(`updatedDoc ${collection}`, docId);
    } catch (error) {
        console.error(error);
    }

}

export async function removeDoc({ oid, collection, docId, }: { oid: string, collection: string, docId: string }) {
    try {
        await getFirestore().doc(getDocumentPath(oid, collection, docId)).delete();
        console.log(`removedDoc ${collection}`, docId);
    } catch (error) {
        console.error(error);
    }

}

