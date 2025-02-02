import type { BaseDataModel } from "$lib/core/types/app-types";


export type InvoiceDataModel = BaseDataModel & {
    invoiceNo?:string;
    amount?:string
}