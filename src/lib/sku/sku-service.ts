import { getAuthOrgId, getToken } from "$lib/auth/services/auth-service.svelte";
import { APP_ID, FIREBASE_DATABASE_URL } from "$lib/core/services/app-environment-service";
import axios from "axios";
import type { SkuDataModel } from "./sku-types";
import { getDatabase, ref, set } from "firebase/database";
import { alphabetNanoid } from "@cloudparker/moldex.js";


export async function createSku(sku: SkuDataModel,) {
    console.log('createSku', sku)
    let id = alphabetNanoid(5);
    return updateSku(id, sku)
}

export async function updateSku(id: string, sku: SkuDataModel) {
    if (sku && sku.name && sku.price != null) {
        id = id || alphabetNanoid(5);
        const db = getDatabase();
        delete sku._id
        await set(ref(db, `/a/${APP_ID}/skus/` + id), sku);
        sku._id = id;
        return sku
    }
    return null
}

export async function deleteSku(id: string,) {
    if (id) {
        const db = getDatabase();
        await set(ref(db, `/a/${APP_ID}/skus/` + id), null);
        return id
    }
    return null
}

export async function getAllSkus(): Promise<SkuDataModel[]> {
    let token = await getToken()
    let oid = getAuthOrgId()
    if (oid) {
        let url = `${FIREBASE_DATABASE_URL}/a/${APP_ID}/skus.json?auth=${token}`;
        let res = await axios.get(url);
        if (res) {
            // console.log('SKUS', res.data)
            return Object.keys(res.data).map(key => {
                return { _id: key, ...(res.data[key] || {}) } as SkuDataModel
            });
        }
    }
    return [];
}