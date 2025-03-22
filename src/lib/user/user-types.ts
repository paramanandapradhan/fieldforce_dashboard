
import type { BaseDataModel } from "$lib/core/types/app-types";
import type { UserSubtypeEnum, UserTypeEnum } from "./user-service";


export type ClaimUsers = {
    _id: string,
    oid: string,
    rid: string
}
export type UserDataModel = BaseDataModel & {
    name?: string;
    desc?: string;
    type?: UserTypeEnum;
    subtype?: UserSubtypeEnum;
    photo?: string;
    phone?: string;
    email?: string;
    team?: string;
    manager?: string;
    gen?: string;
    rid?: string;
    ur?: boolean;
    us?: boolean;
    _eauid?: string;
    _pauid?: string;
    note?: string;
    idType1?: string;
    idNo1?: string;
    idType2?: string;
    idNo2?: string;
    dob?: any;
    doj?: any; // date of join
    dor?: any; // date of release
    categories?: string
    address?: string;
    desig?: string;
    dept?: string;
    geo?: CustomerGeo;
    isActive?: boolean,
    canOrder?: boolean,
    extId?: string,
}

export type UserDataModelExtraType<T> = UserDataModel & {
    extra?: T,
}

export type CustomerDataModel = UserDataModel & {
    billing?: CustomerBilling,
    delivery?: CustomerDelivery,
    owner?: CustomerOwner,
    master?: CustomerMaster,
    geo?: CustomerGeo;
    canPlaceOrder?: boolean,
}

export type RetailerDatabodel = CustomerDataModel & {};

export type CustomerGeo = {
    country?: string;
    state?: string,
    city?: string;
    area?: string;
    district?: string;
    locality?: string,
    street?: string;
    landmark?: string;
    pincode?: string;
    location?: number[];
}

export type CustomerIdentity = {
    taxNo?: string,
    aadharNo?: string;
    panNo?: string,
    voterId?: string,
    securityCheck?: string,
    drivingLicence?: string;
    otherNo?: string;
    otherNoName?: string,
}

export type CustomerMaster = {
    customerType?: string,
    company?: string,
    branch?: string,
    seller?: string,
    sm?: string,
    tsm?: string,
    route?: string,
    chain?: string,
    clazz?: string,
    label?: string,
    extId?: string,
    creditLimit?: string,

}

export type CustomerOwner = {
    name?: string,
    address?: string,
    phone?: string,
    email?: string,
    dob?: string,
}
export type CustomerBilling = {
    name?: string,
    address?: string,
    taxNo?: string,
    phone?: string,
    email?: string,
}

export type CustomerDelivery = {
    name?: string,
    address?: string,
    taxNo?: string,
    phone?: string,
    email?: string,
}

