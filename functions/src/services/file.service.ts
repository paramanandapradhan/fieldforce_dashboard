import { FieldValue, getFirestore } from "firebase-admin/firestore";

import { FileDataModel } from "../types/types";
import { StorageObjectData } from "firebase-functions/v2/storage";
import { createRtdbNumberId } from "./rtdb-service";

export enum FieldTypeEnum {
    SINGLE = 's',
    ARRAY = 'a'
}

export function getFilesCollectionPath(oid: string) {
    return `/a/${process.env.VITE_APP_ID}/o/${oid}/files`;
}

export function getFilesDocumentPath(oid: string, fid: string) {
    return `/a/${process.env.VITE_APP_ID}/o/${oid}/files/${fid}`;
}

export async function createNewFileId(oid: string, sufix: string) {
    return await createRtdbNumberId({ org: oid, key: 'files' });
    // return `${nanoid(7)}${sufix}`;
}

export async function createFile({ fileId, oid, uid = '', collection, docId = '', data, path, fieldType }: {
    fileId: string, oid: string, uid: string, docId: string, path: string, collection: string, data: StorageObjectData, fieldType: FieldTypeEnum
}) {
    let payload: FileDataModel = {
        path: path,
        type: data.contentType,
        size: parseInt('' + (data.size || 0)),
        oid,
        cby: uid,
        cat: FieldValue.serverTimestamp(),
    };
    await getFirestore().doc(getFilesDocumentPath(oid, fileId))
        .set(payload);

    console.log('createFileDoc success', 'fileId: ', fileId);

    return fileId
}

export async function updateFile({ oid, fid, payload }: {
    oid: string, fid: string, payload: any
}) {
    await getFirestore().doc(getFilesDocumentPath(oid, fid))
        .update(payload, { merge: true });
    console.log('updateFileDoc success', 'fid: ', fid);

    return fid
}

export async function removeFile({ oid, fid }: {
    oid: string, fid: string,
}) {
    await getFirestore().doc(getFilesDocumentPath(oid, fid))
        .delete();
    console.log('removeFileDoc success', 'fid: ', fid);

    return fid
}



