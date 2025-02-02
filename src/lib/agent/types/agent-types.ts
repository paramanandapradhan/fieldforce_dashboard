import type { BaseDataModel, } from "$lib/core/types/app-types";

export type AgentDataModel = BaseDataModel & {
    name?: string,
    desc?: string,
    lang?: string,
    gender?: string,
    voice?: string,
    voiceName?: string,
    knowledge?: string
    callPrice?: number,
    chatPrice?: number,
}
