import type { BaseDataModel } from "$lib/core/types/app-types";


export type ProductDataModel = BaseDataModel & {
    name?:string
    desc?:string
    mrp?:number
    salesPrice?:number
}