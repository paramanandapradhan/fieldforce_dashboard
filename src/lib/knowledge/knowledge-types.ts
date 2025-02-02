
import type { BaseDataModel } from "$lib/core/types/app-types";
 
export type KnowledgeDataModel = BaseDataModel & {
     topic?:string;
     agent?:string;
     text?:string;
     embedding?:string;
}
 