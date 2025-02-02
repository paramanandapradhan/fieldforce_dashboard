import { getAuthOrgId, getToken } from "$lib/auth/services/auth-service.svelte";
import { DatabaseService } from "$lib/database/database-service";
import { PLIVO_WORKER_ENDPOINT, APP_ID } from "$lib/core/services/app-environment-service";
import { IdbWhere } from "@cloudparker/easy-idb";
import type { PhoneDataModel, PhonePlivoData } from "./phone-types";
import axios from "axios";

class PhoneDatabaseService extends DatabaseService<PhoneDataModel> {

    // Indicates if sync is enabled
    protected syncEnabled: boolean = false;

    // Name of the Firestore collection
    protected collectionName: string = 'phones';

    constructor() {
        super();
    }

    // Constructs the Firestore collection path for phones
    public getFirestoreCollectionPath(): string {
        let path = `/a/${APP_ID}/o/${getAuthOrgId()}/${this.collectionName}`;
        return path;
    }

    public async createPhone(data: PhoneDataModel, id?: string) {
        return super.createFirestoreDoc(data, id);
    }

    public async updatePhone(id: string, data: PhoneDataModel) {
        return super.updateFirestoreDoc(id, data);
    }

    public async deletePhone(id: string) {
        return super.deleteFirestoreDocSoft(id);
    }

    public async getPhone(id: string) {
        return super.getOneLocal(id);
    }

    public async getAllPhones() {
        return this.findPhonesLocal()
    }

    public async syncPhones() {
        return super.sync();
    }

    public async getPhoneCache(id: string) {
        return super.getOneCache(id)
    }

    protected async findPhonesLocal() {
        let store = await this.getLocalDatabaseStore();
        let oid = getAuthOrgId();
        if (oid) {
            let whereKeys: string[] = ['oid'];
            let whereValue: any[] = [oid];
            let where = IdbWhere(whereKeys, "==", whereValue);
            let array = await store.find<PhoneDataModel>({ where })!;
            return array;
        }
        return [] as PhoneDataModel[];
    }

}


const phoneService = new PhoneDatabaseService();

export async function createPhone(data: PhoneDataModel, id?: string) {
    return phoneService.createPhone(data, id);
}

export async function updatePhone(id: string, data: PhoneDataModel) {
    return phoneService.updatePhone(id, data);
}

export async function deletePhone(phoneNumber: string) {
    // return phoneService.deletePhone(id);
    let token = await getToken(true);
    const url = PLIVO_WORKER_ENDPOINT + '/phone/remove';
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            number: phoneNumber
        })
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
    }
    const result = await response.json();
    console.log('Phone number removed successful:', result);

    return response;


}
export async function buyPhoneNumber(number: string, plan: string) {
    let token = await getToken(true);
    const url = `${PLIVO_WORKER_ENDPOINT}/phone/buy`;
    let payload = { number: number, plan: plan }
    let response = await axios.post(url, payload, { headers: { 'Authorization': `Bearer ${token}` } })
    return response?.data?.data;
}

export async function getPhone(id: string) {
    return phoneService.getPhone(id);
}

export async function getAllPhones() {
    return phoneService.getAllPhones();
}

export async function syncPhones() {
    return phoneService.syncPhones();
}

export async function getPhoneCache(id: string) {
    return phoneService.getPhoneCache(id)
}

export async function searchPhoneNumber(countryIso: string, type: string, pattern: string, offset: number) {
    let token = await getToken(true);
    let params = {
        countryIso: countryIso,
        type: type,
        pattern: pattern,
        offset: '' + (offset || 0)
    }
    let queryParams = new URLSearchParams(params).toString()
    const url = `${PLIVO_WORKER_ENDPOINT}/phone/search?${queryParams}`;
    let response = await axios.get(url, { headers: { 'Authorization': `Bearer ${token}` } })
    return (response.data?.data || []) as PhonePlivoData[];
}
