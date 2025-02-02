import { onDocumentDeleted } from "firebase-functions/v2/firestore";
import { FileDataModel } from "../types/types";
import { removeObject } from "../services/storage.service";
import { updateFieldCounter } from "../services/rtdb-service";

export const onFileDeleted = onDocumentDeleted(`/a/${process.env.VITE_APP_ID}/o/{oid}/files/{fid}`,
    async (event) => {
        let oldFile: FileDataModel = event.data?.data() || {};
        const fid: string = event.params.fid;
        const oid: string = event.params.oid;

        if (oid && fid && oldFile && oldFile.path) {

            let path = oldFile.path;

            let bucket = process.env.VITE_FIREBASE_STORAGE_BUCKET!;

            console.log('onFileDeleted deleting...', { bucket, path, });

            let tasks = [];

            tasks.push(updateFieldCounter({ oid, coll: 'fields', field: 'size', update: (oldFile.size || 0) * -1 }))
            tasks.push(removeObject({ bucket, path }));

            await Promise.all(tasks);
        }
    });