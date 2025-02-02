
import { getAuthOrgId, getAuthOrgUserId } from "$lib/auth/services/auth-service.svelte";
import { APP_ID, APP_TTL_DAYS } from "$lib/core/services/app-environment-service";
import { DatabaseService } from "$lib/database/database-service";
import { IdbWhere } from "@cloudparker/easy-idb";
import type { KeyvalueDataModel } from "./keyvalue-types";
import { doc, getFirestore, serverTimestamp, setDoc } from "firebase/firestore";
import { getDateIncrement } from "$lib/core/services/app-utils-service";




class KeyvalueDatabaseService extends DatabaseService<KeyvalueDataModel> {

    // Indicates if sync is enabled
    protected syncEnabled: boolean = false;

    // Name of the Firestore collection
    protected collectionName: string = 'keyvalues';

    // Private constructor to prevent direct instantiation
    constructor() {
        super();
    }

    protected async createFirestoreId(): Promise<string> {
        throw Error('Should not create firestore Id for key-value collection')
    }

    // Constructs the Firestore collection path for agents
    public getFirestoreCollectionPath(): string {
        let path = `/a/${APP_ID}/o/${getAuthOrgId()}/${this.collectionName}`;
        return path;
    }

    public async createKeyvalue(data: KeyvalueDataModel, id: string) {
        if (typeof id !== 'string' || id.length <= 1 || /[^a-zA-Z0-9]/.test(id)) {
            throw new Error('Invalid keyvalue ID: ' + id);
        }
        return super.createFirestoreDoc(data, id);
    }

    public async updateKeyvalue(id: string, data: KeyvalueDataModel) {
        return super.updateFirestoreDoc(id, data);
    }

    public async deleteKeyvalue(id: string) {
        return super.deleteFirestoreDocSoft(id);
    }

    public async getKeyvalue(id: string) {
        return super.getOneLocal(id);
    }

    public async getAllKeyvalues() {
        return this.findKeyvaluesLocal()
    }

    public async syncKeyvalues() {
        return super.sync();
    }

    public async getKeyvalueCache(id: string) {
        return super.getOneCache(id)
    }

    protected async findKeyvaluesLocal() {
        let store = await this.getLocalDatabaseStore();
        let oid = getAuthOrgId();
        if (oid) {
            let whereKeys: string[] = ['oid'];
            let whereValue: any[] = [oid];

            let where = IdbWhere(whereKeys, "==", whereValue);
            let array = await store.find<KeyvalueDataModel>({ where })!;
            return array;
        }
        return [] as KeyvalueDataModel[];
    }

    protected async updateFirestoreDocImpl(id: string, data: KeyvalueDataModel): Promise<void> {
        data.uat = serverTimestamp();
        data.oid = getAuthOrgId();
        data.uby = getAuthOrgUserId();
        delete data.cat;
        delete data.cby;
        if (data && data.isDel) {
            data.ttl = getDateIncrement(parseInt(APP_TTL_DAYS || '1'));
        }
        await setDoc(doc(getFirestore(), this.getFirestoreCollectionPath(), id), data);
    }
}


const keyvalueService = new KeyvalueDatabaseService();

// export async function createKeyvalue(data: KeyvalueDataModel, id: string) {
//     return keyvalueService.createKeyvalue(data, id);
// }

export async function updateKeyvalue(id: string, data: KeyvalueDataModel) {
    return keyvalueService.updateKeyvalue(id, data);
}

export async function deleteKeyvalue(id: string) {
    return keyvalueService.deleteKeyvalue(id);
}

export async function getKeyvalue(id: string) {
    return keyvalueService.getKeyvalue(id);
}

export async function getAllKeyvalues() {
    return keyvalueService.getAllKeyvalues();
}

export async function syncKeyvalues() {
    return keyvalueService.syncKeyvalues();
}

export async function getKeyvalueCache(id: string) {
    return keyvalueService.getKeyvalueCache(id)
}
