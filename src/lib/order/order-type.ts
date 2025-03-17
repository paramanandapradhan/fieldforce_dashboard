import type { CartDataModel } from "$lib/cart/cart-types";
import type { BaseDataModel } from "$lib/core/types/app-types";


export type OrderDataModel = BaseDataModel & {
    customer?: string,
    seller?: string,
    items?: CartDataModel[],
    note?: string,
    paymentMode?: string,
    orderType?: string,
    amount?: number,
    date?: any
}