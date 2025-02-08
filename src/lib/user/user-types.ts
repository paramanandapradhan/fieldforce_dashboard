
import type { BaseDataModel } from "$lib/core/types/app-types";

export enum UserTypeEnum {
    USER_TYPE_USER = 'u',
    USER_TYPE_CUSTOMER = 'c',
}

export enum UserSubtypeEnum {
    USER_SUBTYPE_USER_STAFF = 's',
    USER_SUBTYPE_USER_SM = 'm',
    USER_SUBTYPE_USER_TSM = 't',
    USER_SUBTYPE_USER_DISTRIBUTOR = 'd',
    USER_SUBTYPE_CUSTOMER_CONSUMER = 'c',
    USER_SUBTYPE_CUSTOMER_RETAILER = 'r',
}

export type UserDataModel = BaseDataModel & {
    name?: string;
    desc?: string;
    type?: UserTypeEnum;
    photo?: string;
    phone?: string;
    email?: string;
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
    address?: string;
    city?: string;
    state?: string
    country?: string;
    categories?: string
    pin?: string;
    desig?: string;
    dept?: string;
    subtype?: string;
    isActive?: boolean,
    canOrder?: boolean,
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
}

export type RetailerDatabodel = CustomerDataModel & {};

export type CustomerGeo = {
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
    distributor?: string,
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

