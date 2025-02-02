
import type { BaseDataModel } from "$lib/core/types/app-types";
import type { FieldValue } from "firebase/firestore";

export enum CallTypeEnum {
    PHONE = 'p',
    CALL = 'c',
    CHAT = 't'
}

export enum CallStatusEnum {
    RINGING = 'r',
    ENDED = 'e',
    CONNECTED = 'c',
    HOLD = 'h'

}

export type CallDataModel = BaseDataModel & {
    type?: CallTypeEnum,
    from?: string;
    to?: string;
    meter?: number | FieldValue;
    pricing?: {
        call?: number,
        phone?: number,
        chat?: number,
    },
    date?: any,
    agent?: string,
    duration?: number,
    status?: CallStatusEnum
}
