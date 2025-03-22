import { DatabaseService } from "$lib/database/database-service";
import { APP_ID, FIREBASE_DATABASE_URL } from "$lib/core/services/app-environment-service";
import { doc, getFirestore, serverTimestamp, setDoc } from "firebase/firestore";

import type { OrgDataModel } from "./org-types";
import { createRtdbNumberId } from "$lib/firebase/rtdb-service";
import axios from "axios";
import { getAuthOrgId, getToken } from "$lib/auth/services/auth-service.svelte";

class OrgDatabaseService extends DatabaseService<OrgDataModel> {

    protected syncEnabled: boolean = false;
    protected collectionName: string = 'orgs';

    private orgMap: { [key: string]: OrgDataModel } = {}

    constructor() {
        super();
    }

    protected async createFirestoreId(): Promise<string> {
        let id = await createRtdbNumberId({ key: this.collectionName });
        return id;
    }

    public getFirestoreCollectionPath(): string {
        return `/a/${APP_ID}/o`;
    }

    protected async createFirestoreDocImpl(id: string, data: OrgDataModel): Promise<void> {
        data.cby = '1';
        data.uby = '1';
        data.cat = serverTimestamp();
        data.uat = serverTimestamp();
        const path = this.getFirestoreCollectionPath();
        await setDoc(doc(getFirestore(), path, id), data);
    }


    public async createOrg(data: OrgDataModel, id?: string) {
        return super.createFirestoreDoc(data, id);
    }

    public async updateOrg(id: string, data: OrgDataModel) {
        return super.updateFirestoreDoc(id, data);
    }

    public async deleteOrg(id: string) {
        return super.deleteFirestoreDocSoft(id);
    }

    public async getOrg(id: string) {
        let org: OrgDataModel | null = this.orgMap[id];
        if (!org) {
            org = await super.getOneFirestoreDoc(id);
            if (org) {
                this.orgMap[id] = org;
            }
        }
        return org;
    }

    public async getAllOrgs() {
        return super.getAllLocal();
    }

    public async syncOrg(id: string) {
        return super.sync();
    }

    public async getOrgCache(id: string) {
        return super.getOneCache(id);
    }

}

const orgService = new OrgDatabaseService();

export async function createOrg(data: OrgDataModel) {
    return orgService.createOrg(data);
}

export async function updateOrg(id: string, data: OrgDataModel) {
    return orgService.updateOrg(id, data);
}

export async function deleteOrg(id: string) {
    return orgService.deleteOrg(id);
}

export async function getOrg(id: string) {
    return orgService.getOrg(id);
}

export async function getAllOrgs() {
    return orgService.getAllOrgs();
}

export async function syncOrg(id: string) {
    return orgService.syncOrg(id);
}

export async function getOrgCache(id: string) {
    return orgService.getOrgCache(id);
}

export async function getAccountBalance() {
    let token = await getToken()
    let oid = getAuthOrgId()
    if (oid) {
        let url = `${FIREBASE_DATABASE_URL}/a/${APP_ID}/o/${getAuthOrgId()}.json?auth=${token}`;
        let res = await axios.get(url);
        if (res) {
            // console.log('Balance', res.data)
            return res.data.balance || 0;
        }
    }
    return 0;
}
