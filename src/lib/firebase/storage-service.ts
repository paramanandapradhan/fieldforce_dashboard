import { getStorage, ref, uploadBytes } from "firebase/storage";
import { APP_ID, FIREBASE_STORAGE_BUCKET } from "../core/services/app-environment-service";
import { nanoid } from 'nanoid'
import { getAuthOrgId, getAuthOrgUserId } from "$lib/auth/services/auth-service.svelte";
import { ellipsisFileNameAtCenter } from "@cloudparker/moldex.js";
import { FieldTypeEnum } from "$lib/file/file-service";

/**
 * PUBLIC_STORAGE_BUCKET_HOST provides the public host for Firebase storage. 
 * Its value will be: https://storage.googleapis.com/${FIREBASE_STORAGE_BUCKET}
 */
export const PUBLIC_STORAGE_BUCKET_HOST: string = `https://storage.googleapis.com/${FIREBASE_STORAGE_BUCKET}`;

/**
 * Retrieve the public URL for the specified path.
 * @param path The path for which to generate the public URL.
 * @returns The public URL corresponding to the provided path.
 */
export function getBucketPublicUrl(path: string) {
    if (path) {
        if (path.startsWith(`${APP_ID}/`)) {
            return `${PUBLIC_STORAGE_BUCKET_HOST}/${path}`;
        } else if (path.startsWith(`/${APP_ID}/`)) {
            return `${PUBLIC_STORAGE_BUCKET_HOST}${path}`;
        }
    }
    return path;
}


export async function uploadFileToStorage({ file, field, collection, docId, fileId, fieldType = FieldTypeEnum.SINGLE }: { file: File, field: string, collection: string, docId: string, fileId?: string, fieldType?: FieldTypeEnum }): Promise<string> {
    let oid = getAuthOrgId();
    let uid = getAuthOrgUserId();
    fileId = fileId || nanoid(10);
    if (oid && uid && file && docId && collection && field) {
        let filename = ellipsisFileNameAtCenter(file.name, 20, 10, 5)
        let fileName = filename || file.name;
        // console.log('uploadFileToStorage', file, field, coll, oid, uid, fileName);

        const storagePath = `/a/${APP_ID}/o/${oid}/${collection}/${docId}/${field}/${fieldType}/${uid}/${fileId}/${fileName}`;
        const cacheControl = 'public, max-age=31536000'
        const storageRef = ref(getStorage(), storagePath);
        try {
            await uploadBytes(storageRef, file, {
                cacheControl: cacheControl,
            });
            return storagePath;
        } catch (error) {
            console.error('Error on upload file to storage.');
            console.log(error);
        }
    }
    return fileId as string;
}

