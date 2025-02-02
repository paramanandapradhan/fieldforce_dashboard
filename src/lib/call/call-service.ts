import { getAuthOrgId } from "$lib/auth/services/auth-service.svelte";
import { DatabaseService } from "$lib/database/database-service";
import { APP_ID } from "$lib/core/services/app-environment-service";
import { IdbWhere } from "@cloudparker/easy-idb";
import type { CallDataModel } from "./call-types";

class CallDatabaseService extends DatabaseService<CallDataModel> {

    // Indicates if sync is enabled
    protected syncEnabled: boolean = false;

    // Name of the Firestore collection
    protected collectionName: string = 'calls';

    constructor() {
        super();
    }

    // Constructs the Firestore collection path for calls
    public getFirestoreCollectionPath(): string {
        let path = `/a/${APP_ID}/o/${getAuthOrgId()}/${this.collectionName}`;
        return path;
    }

    public async createCall(data: CallDataModel, id?: string) {
        return super.createFirestoreDoc(data, id);
    }

    public async updateCall(id: string, data: CallDataModel) {
        return super.updateFirestoreDoc(id, data);
    }

    public async deleteCall(id: string) {
        return super.deleteFirestoreDocSoft(id);
    }

    public async getCall(id: string) {
        return super.getOneLocal(id);
    }

    public async getAllCalls() {
        return this.findCallsLocal()
    }

    public async syncCalls() {
        return super.sync();
    }

    public async getCallCache(id: string) {
        return super.getOneCache(id)
    }

    protected async generateId(): Promise<string> {
        return crypto.randomUUID();
    }

    protected async findCallsLocal() {
        let store = await this.getLocalDatabaseStore();
        let oid = getAuthOrgId();
        if (oid) {
            let whereKeys: string[] = ['oid'];
            let whereValue: any[] = [oid];
            let where = IdbWhere(whereKeys, "==", whereValue);
            let array = await store.find<CallDataModel>({ where })!;
            return array;
        }
        return [] as CallDataModel[];
    }

}


const callService = new CallDatabaseService();

export async function createCall(data: CallDataModel, id?: string) {
    return callService.createCall(data, id);
}

export async function updateCall(id: string, data: CallDataModel) {
    return callService.updateCall(id, data);
}

export async function deleteCall(id: string) {
    return callService.deleteCall(id);
}

export async function getCall(id: string) {
    return callService.getCall(id);
}

export async function getAllCalls() {
    return callService.getAllCalls();
}

export async function syncCalls() {
    return callService.syncCalls();
}

export async function getCallCache(id: string) {
    return callService.getCallCache(id)
}
