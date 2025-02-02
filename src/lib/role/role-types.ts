import type { BaseDataModel } from "$lib/core/types/app-types";


export type RoleDataModel = BaseDataModel & {
    name?: string;
    desc?: string;
    scp?: RoleScopes,
}

export type RoleScopes = { [key: string]: FeatureScopeEnum }

export enum FeatureScopeEnum {
    NONE = '0',
    READ = '1',
    WRITE = '2',
    FULL = '3',
}

export type Feature = {
    _id?: string, name?: string, desc?: string,
}

export type FeatureMap = {
    [id: string]: Feature,
}

export type FeatureWithScope  = Feature & {
    scope?: FeatureScopeEnum,
}

