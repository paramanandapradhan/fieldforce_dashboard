import type { BaseDataModel } from "$lib/core/types/app-types";


export type OrgDataModel = BaseDataModel & {
    name?: string,
    desc?: string,
    address?: string,
    taxNo?: string,
    country?: string,
    state?: string,
    city?: string,
    phone?: string,
    email?: string,
    note?: string,
    ownerName?: string,
    ownerPhone?: string,
    ownerEmail?: string,

    /**
     * Photo File id
     */
    photo?: string,

    pref?: OrgPreferenceDataModel,
    billing?: OrgBillingDataModel,

};

export type OrgPreferenceDataModel = {
    dateFormat?: string,
    currency?: string,

}

export type OrgBillingDataModel = {
    address?: string,
    name?: string,
    taxNo?: string,
    phone?: string,
    email?: string,
    country?: string,
    state?: string,
    pincode?: string
}

