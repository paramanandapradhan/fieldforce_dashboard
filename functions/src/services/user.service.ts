import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { getUsersAccessesDocPath, getUsersIdentitiesDocPath } from "../utils/path-utils";
import { UserDataModel } from "../types/types";
import * as admin from 'firebase-admin';

export enum UserEnum {
    USER_STAFF = "1",
    USER_PARTY = "2",
}

export const getUsersCollectionPath = (oid: string) => {
    return `/a/${process.env.VITE_APP_ID}/o/${oid}/users`;
}

export const getUsersDocumentPath = (oid: string, id: string) => {
    return `/a/${process.env.VITE_APP_ID}/o/${oid}/users/${id}`;
}

export const createUser = async ({ oid, id, payload }: { oid: string, id: string, payload: UserDataModel }) => {
    payload.cat = admin.firestore.FieldValue.serverTimestamp();
    payload.uat = admin.firestore.FieldValue.serverTimestamp();
    payload.type = UserEnum.USER_STAFF;

    await getFirestore().doc(getUsersDocumentPath(oid, id))
        .set(payload, { merge: true });
    console.log('createUserDoc success', 'uid: ', id);
}

export const createUsersIdenties = async ({ uid, phoneNumber = '', email = '' }: { uid: string, phoneNumber?: string, email?: string }) => {
    await getFirestore().doc(getUsersIdentitiesDocPath({ uid })).set({ phoneNumber, email }, { merge: true });
    console.log('createUsersIdentiesDoc success', 'uid: ', uid);
}

export const createUsersAccesses = async ({ uid }: { uid: string }) => {
    await getFirestore().doc(getUsersAccessesDocPath({ uid })).set({}, { merge: true });
    console.log('createUsersAccessesDoc success', 'uid: ', uid);
}

export const deleteUsersAccesses = async ({ uid }: { uid: string }) => {
    try {
        await getFirestore().doc(getUsersAccessesDocPath({ uid })).delete();
    } catch (error) {
    }
    console.log('deleteUsersAccessesDoc success', 'uid: ', uid);
}

export const createUsersAccessesEntry = async ({ bookId, uid }: { bookId: string, uid: string }) => {
    try {
        await getFirestore().doc(getUsersAccessesDocPath({ uid })).update({ ['data.' + bookId]: 1 });
    } catch (error) {
        await createUsersAccesses({ uid });
        await getFirestore().doc(getUsersAccessesDocPath({ uid })).update({ ['data.' + bookId]: 1 });
    }
    console.log('createUsersAccessesEntry success', 'uid: ', uid, 'bookId: ', bookId);
}

export const deleteUsersAccessesEntry = async ({ bookId, uid }: { bookId: string, uid: string }) => {
    try {
        await getFirestore().doc(getUsersAccessesDocPath({ uid })).update({ ['data.' + bookId]: FieldValue.delete() });
    } catch (error) {
        console.error(error);
    }
    console.log('createUsersAccessesEntry success', 'uid: ', uid, 'bookId: ', bookId);
}

export const getUser = async ({ oid, uid, }: { oid: string, uid: string }): Promise<UserDataModel | null> => {
    let snapshot = await getFirestore().doc(getUsersDocumentPath(oid, uid)).get();
    if (snapshot.exists) {
        let user: UserDataModel = snapshot.data()!;
        user._id = snapshot.id;
        return user;
    }
    return null;
}

export const updateUser = async ({ oid, uid, payload }: { oid: string, uid: string, payload: { _phoneUid?: string | null, _emailUid?: string | null, photo?: string } }) => {
    try {
        (payload as any).uat = admin.firestore.FieldValue.serverTimestamp();
        await getFirestore().doc(getUsersDocumentPath(oid, uid)).update(payload);
    } catch (error) {
        console.error(error);
    }
    console.log('User updated.');
}

export const findUsersByEmailUid = async (_emailUid?: string): Promise<UserDataModel[]> => {
    let results: UserDataModel[] = [];
    if (_emailUid) {
        let snapshot = await getFirestore().collectionGroup('users').where('_eauid', '==', _emailUid).get()
        if (!snapshot.empty) {
            snapshot.forEach((snap) => {
                let user = snap.data();
                user._id = snap.id;
                results.push(user);
            })

        }
    }
    return results;
}

export const findUsersByPhoneUid = async (_phoneUid?: string): Promise<UserDataModel[]> => {
    let results: UserDataModel[] = [];
    if (_phoneUid) {
        let snapshot = await getFirestore().collectionGroup('users').where('_pauid', '==', _phoneUid).get()
        if (!snapshot.empty) {
            snapshot.forEach((snap) => {
                let user = snap.data();
                user._id = snap.id;
                results.push(user);
            })

        }
    }
    return results;
}




