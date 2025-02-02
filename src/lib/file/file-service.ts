


import { DatabaseService } from "$lib/database/database-service";
import { APP_ID } from "$lib/core/services/app-environment-service";
import { mdiFile, mdiFileDocument, mdiFileExcel, mdiFileImage, mdiFilePdf, mdiFilePowerpointOutline, mdiFileWord } from "$lib/core/services/app-icons-service";
import { uploadFileToStorage } from "$lib/firebase/storage-service";
import { nanoid } from 'nanoid';
import type { FileDataModel } from "./file-type";
import { getAuthOrgId, getAuthOrgUserId } from "$lib/auth/services/auth-service.svelte";
import { IdbWhere } from "@cloudparker/easy-idb";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { ellipsisFileNameAtCenter } from "@cloudparker/moldex.js";
import { ALLOWED_DOCS_EXT_NAMES } from "$lib/core/services/app-utils-service";

let DOWNLOAD_URL_CACHE: { [key: string]: string } = {};

export enum FieldTypeEnum {
    SINGLE = 's',
    ARRAY = 'a',
}

class FileDatabaseService extends DatabaseService<FileDataModel> {

    // Indicates if sync is enabled
    protected syncEnabled: boolean = false;

    // Name of the Firestore collection
    protected collectionName: string = 'files';

    constructor() {
        super();
    }

    // Constructs the Firestore collection path for files
    public getFirestoreCollectionPath(): string {
        let path = `/a/${APP_ID}/o/${getAuthOrgId()}/${this.collectionName}`;
        return path;
    }

    public async createFile(data: FileDataModel, id?: string) {
        return super.createFirestoreDoc(data, id);
    }

    public async updateFile(id: string, data: FileDataModel) {
        return super.updateFirestoreDoc(id, data);
    }

    public async deleteFile(id: string) {
        return super.deleteFirestoreDocSoft(id);
    }

    public async getFile(id: string) {
        return super.getOneLocal(id);
    }

    public async getAllFiles() {
        return this.findFilesLocal()
    }

    public async syncFiles() {
        return super.sync();
    }

    public async getFileCache(id: string) {
        return super.getOneCache(id)
    }

    public async getFileRemote(id: string) {
        return super.getOneFirestoreDoc(id);
    }

    protected async findFilesLocal() {
        let store = await this.getLocalDatabaseStore();
        let oid = getAuthOrgId();
        if (oid) {
            let whereKeys: string[] = ['oid'];
            let whereValue: any[] = [oid];

            let where = IdbWhere(whereKeys, "==", whereValue);
            let array = await store.find<FileDataModel>({ where })!;
            return array;
        }
        return [] as FileDataModel[];
    }

}


const fileService = new FileDatabaseService();

export async function createFile(data: FileDataModel) {
    return fileService.createFile(data);
}

export async function updateFile(id: string, data: FileDataModel) {
    return fileService.updateFile(id, data);
}

export async function deleteFile(id: string) {
    return fileService.deleteFile(id);
}

export async function getFile(id: string) {
    return fileService.getFile(id);
}

export async function getAllFiles() {
    return fileService.getAllFiles();
}

export async function syncFiles() {
    return fileService.syncFiles();
}

export function getFileCache(id: string) {
    return fileService.getFileCache(id)
}

export function getFileRemote(id: string) {
    return fileService.getFileRemote(id)
}

export function getAllowedUploadFileExtentions() {
    let extentions: string[] = [...ALLOWED_DOCS_EXT_NAMES]
    extentions.push(...ALLOWED_DOCS_EXT_NAMES.map(o => o.toUpperCase()));
    extentions = extentions.map(o => '.' + o);
    return extentions.join(',');
}

export async function isImageFileExt(ext: string) {
    return ['jpg', 'jpeg', 'png', 'webp'].includes(ext);
}

export async function createFirestoreId(): Promise<string> {
    let ouid = getAuthOrgUserId();
    return ouid + nanoid(8);
}


/**
 * Upload file to storage and create file doc in firestore
 * @param  file, coll, field, did
 * @returns fid or null. 
 */
export async function uploadFile({ file, collection, field, docId, fileId, fieldType=FieldTypeEnum.SINGLE }:
    {
        /**
         * File object, to be upload
         */
        file: File,

        /**
         * Collection name on which the file to be upload
         */
        collection: string,
        /**
         * Filed name of the document, 
         */
        field: string,
        /**
         * Document id of the collection 
         */
        docId: string,
        /**
         * File id, [Optional]
         */
        fileId?: string | null,

        /**
         * This field will determine how it will update in the target document field.
         * SINGLE => it will update the file id in the target field,
         * ARRAY => it will add this item in traget filed array,
         */
        fieldType?: FieldTypeEnum,
    }
): Promise<string | null> {
    let oid = getAuthOrgId();
    let uid = getAuthOrgUserId();
    fileId = fileId || await createFirestoreId();
    if (oid && uid && file && collection && field && docId && fileId) {
        let path = await uploadFileToStorage({ file, collection, field, docId, fileId, fieldType });
        console.log('path', path);
        // file will be create n the serverside
        // if (path) {
        //     // console.log('File uploaded to storage', path);
        //     let filename = ellipsisFileNameAtCenter(file.name, 20, 10, 5)
        //     let data: FileDataModel = {
        //         path,
        //         size: file.size,
        //         type: file.type,
        //         name: filename || file.name,
        //     }
        //     fileId = await fileService.createFile(data, fileId);
        //     if (fileId) {
        //         console.log('File doc created', fileId);
        //         return fileId;
        //     }
        // }
        return fileId;
    }
    return null;
}

export function isImageFile(file: FileDataModel): boolean {
    return (file.type || '').startsWith('image');
}

export function isDocumentFile(file: FileDataModel): boolean {
    return (file.type || '').startsWith('application');
}

export function isAudioFile(file: FileDataModel): boolean {
    return (file.type || '').startsWith('audio');
}

export function isVideoFile(file: FileDataModel): boolean {
    return (file.type || '').startsWith('video');
}

export function isPdfFile(file: FileDataModel): boolean {
    return (file.type || '').startsWith('application/pdf');
}

export function isTextFile(file: FileDataModel): boolean {
    return (file.type || '').startsWith('text');
}

export function isXlsFile(file: FileDataModel): boolean {
    return (file.type || '').startsWith('application/vnd.ms-excel')
        || (file.type || '').startsWith("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
}

export function isPptFile(file: FileDataModel): boolean {
    return (file.type || '').startsWith('application/vnd.ms-powerpoint');

}

export function isDocFile(file: FileDataModel): boolean {
    return (file.type || '').startsWith('application/msword')
        || (file.type || '').startsWith('application/vnd.openxmlformats-officedocument.wordprocessingml.document');
}


export function getFileIcon(file: FileDataModel): string {
    if (file.type) {
        if (isImageFile(file)) {
            return mdiFileImage;
        } else if (isPdfFile(file)) {
            return mdiFilePdf;
        } else if (isTextFile(file)) {
            return mdiFileDocument;
        } else if (isXlsFile(file)) {
            return mdiFileExcel;
        } else if (isDocFile(file)) {
            return mdiFileWord
        } else if (isPptFile(file)) {
            return mdiFilePowerpointOutline;
        }
    }
    return mdiFile;
}



/**
* 
* get download url for a file, it will fetch download url from firebase and put in memory cache.
* in case of image user photo it will save in indexwd db for future usages. 
* 
* `/a/${process.env.VITE_APP_ID}/o/{oid}/{coll}/{did}/{field}/{uid}/{fid}/{fileName}`
* 
* 
* {
* 0: 'a', 
* 1: '{aid}',
* 2: 'o',
* 3: '{oid}',
* 4: '{coll}', 
* 5: '{did}', 
* 6: '{field}', 
* 7: '{uid}',
* 8: '{fid}', 
* 9: '{fileName}'
* }
*/
export async function getCacheFileDownloadUrl(fid?: string) {
    console.log('getCacheFileDownloadUrl', fid);
    if (fid) {
        let oid = getAuthOrgId()
        let key = `${oid}-${fid}`;
        let downloadUrl = DOWNLOAD_URL_CACHE[key];
        if (!downloadUrl) {
            let file = await getFile(fid);
            if (!file) {
                file = await getFileRemote(fid);
            }
            if (file && file.path) {
                if (file._durl) {
                    downloadUrl = file._durl
                } else {
                    // console.log('file.path', file.path)
                    downloadUrl = await getDownloadURL(ref(getStorage(), file.path));
                }
                if (downloadUrl) {
                    DOWNLOAD_URL_CACHE[key] = downloadUrl;
                }
            }
        }
        return downloadUrl;
    }
    return null;
}




