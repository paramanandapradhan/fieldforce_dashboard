import type { BaseDataModel } from "$lib/core/types/app-types";


export type RetailerDataModel = BaseDataModel & {
    name?: string,
    desc?: string,
    email?: string,
    phone?: string,
    altPhone?: string,
    address?: string,
    company?: string,
    billing?: RetailerBilling,
    delivery?: RetailerDelivery,
    owner?: RetailerOwner,
    master?: RetailerMaster,
    isActive?: boolean,
    identity?: RetailerIdentity;
    geo?: RetailerGeo;
}

export type RetailerGeo = {
    country?: string;
    state?: string,
    city?: string;
    district?: string;
    locality?: string,
    street?: string;
    landmark?: string;
    pincode?: string;
    location?: number[];
}

export type RetailerIdentity = {
    taxNo?: string,
    aadharNo?: string;
    panNo?: string,
    voterId?: string,
    securityCheck?: string,
    drivingLicence?: string;
    otherNo?: string;
    otherNoName?: string,
}

export type RetailerMaster = {
    branch?: string,
    distributor?: string,
    sm?: string,
    tsm?: string,
    route?: string,
    type?: string,
    subType?: string,
    chain?: string,
    clazz?: string,
    label?: string,
    extId?: string,
    creditLimit?: string,
}

export type RetailerOwner = {
    name?: string,
    address?: string,
    phone?: string,
    email?: string,
    dob?: string,
}
export type RetailerBilling = {
    name?: string,
    address?: string,
    taxNo?: string,
    phone?: string,
    email?: string,
}

export type RetailerDelivery = {
    name?: string,
    address?: string,
    taxNo?: string,
    phone?: string,
    email?: string,
}
