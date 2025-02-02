import { getAuthOrgId } from "$lib/auth/services/auth-service.svelte";
import { DatabaseService } from "$lib/database/database-service";
import { APP_ID } from "$lib/core/services/app-environment-service";
import { IdbWhere } from "@cloudparker/easy-idb";
import type { RetailerDataModel, } from "./retailer-types";


class RetailerDatabaseService extends DatabaseService<RetailerDataModel> {

    // Indicates if sync is enabled
    protected syncEnabled: boolean = false;

    // Name of the Firestore collection
    protected collectionName: string = 'retailers';

    // Private constructor to prevent direct instantiation
    constructor() {
        super();
    }

    // Constructs the Firestore collection path for retailers
    public getFirestoreCollectionPath(): string {
        let path = `/a/${APP_ID}/o/${getAuthOrgId()}/${this.collectionName}`;
        return path;
    }

    public async createRetailer(data: RetailerDataModel, id?: string) {
        return super.createFirestoreDoc(data, id);
    }

    public async updateRetailer(id: string, data: RetailerDataModel) {
        return super.updateFirestoreDoc(id, data);
    }

    public async deleteRetailer(id: string) {
        return super.deleteFirestoreDocSoft(id);
    }

    public async getRetailer(id: string) {
        return super.getOneLocal(id);
    }

    public async getAllRetailers() {
        return this.findRetailersLocal()
    }

    public async syncRetailers() {
        return super.sync();
    }

    public async getRetailerCache(id: string) {
        return super.getOneCache(id)
    }

    protected async findRetailersLocal() {
        let store = await this.getLocalDatabaseStore();
        let oid = getAuthOrgId();
        if (oid) {
            let whereKeys: string[] = ['oid'];
            let whereValue: any[] = [oid];
            let where = IdbWhere(whereKeys, "==", whereValue);
            let array = await store.find<RetailerDataModel>({ where })!;
            return array;
        }
        return [] as RetailerDataModel[];
    }

}


const retailerService = new RetailerDatabaseService();

export async function createRetailer(data: RetailerDataModel, id?: string) {
    return retailerService.createRetailer(data, id);
}

export async function updateRetailer(id: string, data: RetailerDataModel) {
    return retailerService.updateRetailer(id, data);
}

export async function deleteRetailer(id: string) {
    return retailerService.deleteRetailer(id);
}

export async function getRetailer(id: string) {
    return retailerService.getRetailer(id);
}

export async function getAllRetailers() {
    return retailerService.getAllRetailers();
}

export async function syncRetailers() {
    return retailerService.syncRetailers();
}

export async function getRetailerCache(id: string) {
    return retailerService.getRetailerCache(id)
}
