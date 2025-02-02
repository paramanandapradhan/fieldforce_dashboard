
import type { BaseDataModel } from "$lib/core/types/app-types";

export enum PhoneTypeEnum {
    PHONE_LOCAL = 'local',

}

export enum PhonePlans {
    MONTHLY = 'm',
    YEARLY = 'y'
}

export type PhoneDataModel = BaseDataModel & {
    desc?: string,
    agent?: string,
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

}

export type PhonePlivoData = {
    number: string;
    monthly_rental_rate: number;
    yearly_rental_rate: number;
    region: string;
    voice_rate: string;
    type: string;
    country: string;
    city: string;
    rate_center: string;
    sms_enabled: boolean;
    sms_rate: string;
    voice_enabled: boolean;
}
