
import type { BaseDataModel } from "$lib/core/types/app-types";

export enum UserTypeEnum {
    USER_TYPE_STAFF = '1',
    USER_TYPE_CUSTOMER = '2',
}

export type UserDataModel = BaseDataModel & {
    /**
     * Name of the user
     */
    name?: string;

    /**
     * Describe the user
     */
    desc?: string;

    /**
     * User type.  UserTypeEnum.USER_STAFF | UserTypeEnum.USER_CUSTOMER
     */
    type?: UserTypeEnum;


    /**
     * User Photo, file ref id.
     */
    photo?: string;

    /**
     * User Phone number
     */
    phone?: string;

    /**
     * User email address
     */
    email?: string;

    /**
    * User Gender
    */
    gen?: string;

    /**
     * Role ID
     */
    rid?: string;

    /**
     * Root User, it will be applicable only for the Developers organization (which organization is == 1)
     */
    ur?: boolean;

    /**
    * Support User, it will be applicable only for the Developers organization (which organization is == 1)
    */
    us?: boolean;

    /**
     * Email Auth User Firebase ID. (firebase user uid)
     */
    _eauid?: string;

    /**
    * Phone Auth User Firebase ID. (firebase user uid)
    */
    _pauid?: string;

    /**
     * Any note about the user
     */
    note?: string;


    /**
     * Id Proof type, it will be attribute type id.
     */
    ipf?: string;

    /**
     * Id Proof number.
     */
    ipn?: string;

    /**
     * User documents, reference of the Documents ids.
     */
    docs?: string[];

    /**
     * Date of Birth
     */
    dob?: any;

    /**
     * Date of Joining
     */
    doj?: any;

    /**
     * Date of Releave
     */
    dor?: any;

    /**
     * User Address
     */
    addr?: string;

    /** 
     * User City, City Attribute id
     */
    ct?: string;

    /**
     * User State, State Attribute  id
     */
    st?: string

    /**
    * User Country, State Attribute  id
    */
    ctry?: string

    /**
     * User zip code or postal pincode
     */
    pin?: string;

    /**
     * User Designation, Attribute id. It will be applicable for user.type== UserTypeEnum.USER_STAFF.
     */
    desig?: string;

    /**
    * User Department, Attribute id. It will be applicable for user.type== UserTypeEnum.USER_STAFF.
    */
    dept?: string;

    /**
     * User subType, Attribute ids. It will be applicable for.
     */
    stype?: string;

    /**
    * User Tags, Attribute ids. It will be applicable for user.type== UserTypeEnum.USER_TAG.
    */
    tags?: string[];

}

export type UserDataModelExtraType<T> = UserDataModel & {
    extra?: T,
}

export type CustomerDataModel = BaseDataModel & {
    name?: string,
    desc?: string,
    email?: string,
    phone?: string,
    altPhone?: string,
    address?: string,
    billing?: CustomerBilling,
    delivery?: CustomerDelivery,
    owner?: CustomerOwner,
    master?: CustomerMaster,
    isActive?: boolean,
    identity?: CustomerIdentity;
    geo?: CustomerGeo;
}

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
    type?: string,
    subType?: string,
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

