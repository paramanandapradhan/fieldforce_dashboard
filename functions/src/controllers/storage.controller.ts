// import { onObjectFinalized } from 'firebase-functions/v2/storage'
// import { createFile } from '../services/file.service';

import { onObjectFinalized, StorageEvent } from "firebase-functions/storage";
import { createFile, FieldTypeEnum, updateFile } from "../services/file.service";
import { getDoc, updateDoc } from "../services/firestore.service";
import { FieldValue } from "firebase-admin/firestore";


// Disabled because we are handling fileupload from client side
// Client will handle to update the file and create file doc document
// Thisimplemention is to use to avaid delay update of firebase function trigger.

export const onStorageUploadCompleted = onObjectFinalized(async (event: StorageEvent) => {
    const bucket = event.bucket; // The Storage bucket that contains the file.
    let filePath = event.data.name; // File path in the bucket.
    let contentType = event.data.contentType; // File content type.
    let size = event.data.size; // File size in bytes.

    // let metageneration = object.metageneration; // Number of times metadata has been generated. New objects have a value of 1.

    /**
     *
     * `/a/${process.env.VITE_APP_ID}/o/{oid}/{coll}/{did}/{field}/{type}/{uid}/(fileId)/{fileName}`
     *
     * Splited Above Path
     *
     * 0: 'a',
     * 1: '{aid}',
     * 2: 'o',
     * 3: '{oid}',
     * 4: '{coll}',
     * 5: '{docId}',
     * 6: '{field}',
     * 7: '{fieldType}'
     * 8: '{uid}',
     * 9: {fileId}
     * 10: '{fileName}'
     */
    let pathSegments = filePath.split('/');

    /**
     * Application ID, same as = APP_ID
     */
    let appId = pathSegments[1];

    /**
     * Organization ID
     */
    let oid = pathSegments[3];


    /**
     * Collection Name
     */
    let collection = pathSegments[4];

    /**
    * Document ID
    */
    let docId = pathSegments[5];

    /**
     * Target Field Name
     */
    let field = pathSegments[6];

    /**
    * Target Field Name
    */
    let fieldType = pathSegments[7] as FieldTypeEnum;

    /**
     * Uploader user ID
     */
    let uid = pathSegments[9];

    /**
    * File Name
    */
    let fileId = pathSegments[9];

    /**
     * File Name
     */
    let fileName = pathSegments[10];

    console.log('onStorageUploadComplete data', event.data);
    console.log({ bucket, fileId, filePath, appId, oid, uid, contentType, size, collection, docId, field, fieldType, fileName, date: new Date() });


    let doc = await getDoc({ collection: collection, docId, oid, });

    let tasks = [];
    let task1 = createFile({ fileId, oid, uid: uid, collection, docId, data: event.data, path: filePath, fieldType });
    tasks.push(task1);

    let payload: any = {};
    if (fieldType == FieldTypeEnum.SINGLE) {
        payload[field] = fileId;
        if (doc) {
            // Delete old file if any
            // update file as deleted
            let date = new Date();
            date.setDate(date.getDate() + parseInt(process.env.VITE_TTL_DAYS || '7'))
            let task2 = updateFile({ oid, fid: fileId, payload: { isDel: true, ttl: date } });
            tasks.push(task2);
        }
    } else if (fieldType == FieldTypeEnum.ARRAY) {
        payload[field] = FieldValue.arrayUnion(fileId);
    }

    let task2 = updateDoc({ collection: collection, docId, oid, payload });
    tasks.push(task2);

    await Promise.all(tasks);

    console.log('onStorageUploadComplete file created fileId', fileId);

});


