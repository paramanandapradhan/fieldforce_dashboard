import { StorageObjectData } from "firebase-functions/v2/storage";
import { CountryCode } from "libphonenumber-js";

export type AuthUser = {
    uid?: string;
    displayName?: string;
    email?: string;
    photoURL?: string;
    phoneNumber?: string;
}


export type UserDataModel = {
    _id?: string;
    name?: string;
    desc?: string;
    photo?: string;
    email?: string | null;
    phone?: string | null;
    oid?: string;
    rid?: string;
    cby?: string;
    uby?: string;
    cat?: any;
    uat?: any;
    ur?: boolean;
    us?: boolean;
    type?: string;
    _eauid?: string;
    _pauid?: string;
    default?: boolean;
}

export type UserIdentityDataModel = {
    _id?: string;
    fuid?: string;
    phone?: string;
    email?: string;
    countryCode?: CountryCode;
    password?: string;
    displayName?: string;
    oid?: string;
    uid?: string;
    rid?: string;
}


export type UserClaimsDataModel = {
    _id?: string;
    phone?: string;
    email?: string;
    name?: string;
    photo?: string;
    aud?: string;
    ua?: boolean;
    us?: boolean;
    isActive?: string;
    user_id?: string;
    phone_number?: string;
    auth_time?: string;
    exp?: string;
    iat?: string;
    sub?: string;
    iss?: string;
    firebase?: any;
    _photo?: string;
}



export type OrgDataModel = {
    /**
     * _id of the org doc
     */
    _id?: string;
    /**
     * Organization name
     */
    name?: string;

    /**
     * Organization Description
     */
    desc?: number;

    /**
     * Organization Address
     */
    address?: string;

    /**
     * Orhanization Operated in City
     */
    city?: string;

    /**
    * Orhanization Operated in City Postal PIN/ZIP Code number
    */
    pincode?: string;

    /**
     * Admin User Name
     */
    ownerName?: string;

    /**
     * Admin User Email
     */
    ownerPhone?: string;

    /**
     * Admin User Email
     */
    ownerEmail?: string;

    cat?: any;
    /**
     * Updated At
     */
    uat?: any;

    /**
     * Created By
     */
    cby?: string;

    /**
     * Updated By
     */
    uby?: string;

    /**
    * Mark is the item deleted.
    */
    isDel?: boolean

    /**
     * Time to leave date. it is used to auto cleanup the deleted items
     */
    ttl?: any,

}

export type RoleDataModel = {
    _id?: string;

    /**
     * Role name
     */
    name?: string;

    /**
     * Description of the Role
     */
    desc?: string;

    /**
     * Org ID
     */
    oid?: string;

    /**
     * Stores key value pare map, "feature_id + operation_id"
     * 
     * feature id: 1, 2, 3, ... 9, A, B, C, ... Z, a, b, c, ... z, AA, AB, ...
     * 
     * Operation Id:
     * 
     * 0 -> NONE
     * 
     * 1 -> READ
     * 
     * 2 -> READ / WRITE (NOT DELETE)
     * 
     * 3 -> READ / WRITE / DELETE
     * 
     * ...
     * 
     * 9
     * 
     */
    scp?: { [key: string]: number };

    /**
     * Created At
     */
    cat?: any,

    /**
     * Updated At
     */
    uat?: any,

    cby?: string,
    uby?: string,

    /**
    * Mark is the item deleted.
    */
    isDel?: boolean

    /**
     * Time to leave date. it is used to auto cleanup the deleted items
     */
    ttl?: any,

    /**
     * Default created by system. can not be alter
     */
    default?: boolean
}

export type StorageDataModel = {

    /**
     * original Storage object data
     */
    data?: StorageObjectData;

    /**
     * Uploaded File Path
     */
    filePath?: string;

    /**
     * Application ID, same as = APP_ID
     */
    appId?: string;

    /**
     * Organization ID
     */
    orgId?: string;

    /**
     * Collection Name
     */
    collName?: string;

    /**
    * Document ID
    */
    docId?: string;

    /**
     * Target Field Name
     */
    field?: string;

    /**
     * File Name
     */
    fileName?: string;
}


export type FileDataModel = {
    /**
     * File ID
     */
    _id?: string;

    /**
     * Organization id
     */
    oid?: string;

    /**
     * File path or storage key
     */
    path?: string;

    /**
     * File Size in bytes
     */
    size?: number;

    /**
     * File type
     */
    type?: string;

    /**
     * Created at Time
     **/
    cat?: any;

    /**
     * Crated by user id
     */
    cby?: string;

    /**
     * Mark is the item deleted.
     */
    isDel?: boolean

    /**
     * Time to leave date. it is used to auto cleanup the deleted items
     */
    ttl?: any,

}




export type DocumentDataModel = {
    _id?: string;

    /**
     * Role name
     */
    name?: string;

    /**
     * Description of the Role
     */
    desc?: string;

    /**
     * Org ID
     */
    oid?: string;

    /**
     * Created At
     */
    cat?: any,

    /**
     * Updated At
     */
    uat?: any,

    /**
     * FileId
     */
    file?: string,

    /**
        * Mark is the item deleted.
        */
    isDel?: boolean

    /**
     * Time to leave date. it is used to auto cleanup the deleted items
     */
    ttl?: any,

}


export enum PaymentStatusEnum {
    PENDING = 'p',
    FAILED = 'f',
    SUCCESS = 's'
}

export type PaymentDataModel = {
    _id?: string;
    amount?: number;
    status?: PaymentStatusEnum,
    oid?: string;
    date?: any,
    cat?: any;
    uat?: any
    cby?: string;
    uby?: string;
}



export enum TransactionTypeEnum {
    PAYMENT = 'p',
    BILLING = 'b',

}

export type TransactionDataModel = {
    _id?: string;
    amount?: number;
    date?: any,
    oid?: string;
    cat?: any;
    uat?: any
    cby?: string;
    uby?: string;
    type?: TransactionTypeEnum,
    source?: string,
}

export enum CallTypeEnum {
    PHONE = 'p',
    CALL = 'c',
    CHAT = 't',
}

export enum CallStatusEnum {
    RINGING = 'r',
    ENDED = 'e',
    CONNECTED = 'c',
    HOLD = 'h'

}

export type CallDataModel = {
    _id?: string;
    from?: string;
    to?: string;
    meter?: number;
    type?: CallTypeEnum;
    pricing?: {
        call?: number,
        phone?: number,
        chat?: number,
    },
    date?: any,
    agent?: string,
    duration?: number,
    status?: CallStatusEnum,
}

enum PhonePlans {
    MONTHLY = 'm',
    YEARLY = 'y'
}

export type PhoneDataModel = {
    _id?: string,
    agent?: string,
    lang?: string, // agent primary language
    oid?: string;
    number?: string;
    appId?: string;
    boughtAt?: any; // bought date
    expiryAt?: any; // expiry date
    plan?: PhonePlans;
    planRental?: number;
    rental?: number;  // Monthly provider rental (actual Plivo rental)
    voiceEnabled?: boolean; // Voice enabled in this number by provider
    voiceRate?: number;  // voice rate to the customer
    smsEnabled?: string; // is this SMS enabled number by Provider
    smsRate?: number;   // SMS rate to the customer
    city?: string;
    country?: string;
    region?: string;
    rateCenter?: any;
    countryCode?: string;
    type?: string;
    subType?: string;
    cat?: any, // created at.
    uat?: any, // updated at.
    cby?: string,
    uby?: string,
    tokenVersion?: number,
}

export enum RentalTypeEnum {
    PHONE = 'p',
}

export type RentalDataModel = {
    _id?: string,
    cat?: any,
    uat?: any,
    cby?: string,
    uby?: string,
    type?: RentalTypeEnum,
    source?: string,
    amount?: number,
    oid?: string,
}

export type KnowledgeDataModel = {
    _id?: string,
    oid?: string,
    lang?: string,
    topic?: string,
    text?: string,
    textEn?: string, // Text English
    embedding?: number[],
    agent?: string,
    tags?: string,
    cat?: any,
    uat?: any,
}