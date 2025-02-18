import type { BaseDataModel } from "$lib/core/types/app-types";


export type TeamDataModel = BaseDataModel & {
    name?: string
    desc?: string
    manager?: string
}