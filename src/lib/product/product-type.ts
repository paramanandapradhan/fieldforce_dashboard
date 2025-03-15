import type { BaseDataModel } from "$lib/core/types/app-types";


export type ProductDataModel = BaseDataModel & {
    name?:string
    desc?:string
    mrp?:number
    salePrice?:number
    type?:string
    umo?:string //Unit of masurment
    categories?:string;
    brand?:string;
    batch?:string;
    note?:string;
    details?:string
    seller?:string
}