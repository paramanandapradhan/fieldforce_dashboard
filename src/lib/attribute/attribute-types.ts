import type { BaseDataModel } from "$lib/core/types/app-types";
import type { AttributeTypeEnum } from "./attribute-service";



export type AttributeTypeConfig = {
    _id?: AttributeTypeEnum,
    label?: string,
    hasIcon?: boolean,
    hasChnageIcon?: boolean,
    hasColor?: boolean,
    hasListing?: boolean,
    hasOrder?: boolean,
    iconPath?: string,
    parent?: string,
};

export type AttributeDataModel = BaseDataModel & {
    name?: string;
    desc?: string;
    type?: AttributeTypeEnum;
    order?: number;
    parent?: string,
    iconPath?: string,
    color?: string,
    extras?: AttributeExtrastype,
}

export type AttributeExtrastype = {
    users?: string[],
    attributes?: string[],
}