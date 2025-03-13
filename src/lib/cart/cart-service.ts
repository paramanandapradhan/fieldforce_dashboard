import { getAuthOrgId } from "$lib/auth/services/auth-service.svelte";
import { getLocalDatabaseStore } from "$lib/database/local-database-service";
import type { ProductDataModel } from "$lib/product/product-type";
import { IdbWhere } from "@cloudparker/easy-idb";
import type { CartDataModel } from "./cart-types";

const storeName = 'carts';

export function addToCart({ product, quantity = 0, salePrice = 0, uid }: { product: ProductDataModel, quantity: number, salePrice: number, uid: string }) {
    console.log('Add to Kart called!', product._id)
    const store = getLocalDatabaseStore(storeName);
    const oid = getAuthOrgId();
    const _id = `${oid}-${uid}-${product._id}`;
    const payload = {
        _id: _id,
        uid,
        oid,
        product: product._id,
        quantity: quantity || 0,
        salePrice,
    }
    if (quantity) {
        let item = store?.get<CartDataModel>(IdbWhere('_id', '==', _id));
        if (item) {
            return store?.update<CartDataModel>(payload);
        } else {
            return store?.insert<CartDataModel>(payload);
        }
    } else {
        return store?.remove(_id);
    }

}


export function getCartItems(uid: string) {
    const store = getLocalDatabaseStore(storeName);
    const oid = getAuthOrgId() || '';
    const where = IdbWhere(['oid', 'uid'], '==', [oid, uid]);

    return store?.find<CartDataModel>({ where });
}

export function removeFromCart(product: ProductDataModel, uid: string) {
    const store = getLocalDatabaseStore(storeName);
    const oid = getAuthOrgId();
    const _id = `${oid}-${uid}-${product._id}`;
    return store?.remove(_id);
}


export async function clearCart(uid: string) {
    const store = getLocalDatabaseStore(storeName);
    let items = await getCartItems(uid);
    let ids = items?.map((item) => item._id!) as string[];
    console.log('Deleting ids', ids);
    return await store?.remove(ids)
}

