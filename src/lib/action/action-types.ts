import type { BaseDataModel } from "$lib/core/types/app-types";
 
export type ActionDataModel = BaseDataModel & {
     name?:string;
     desc?:string;
     agent?:string;
}