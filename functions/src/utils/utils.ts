import { randomInt } from 'crypto';
import { getStorage, } from 'firebase-admin/storage';
import parsePhoneNumber, { CountryCode } from 'libphonenumber-js'


export const addedKeysInJson = ({ oldValue = {}, newValue = {}, }: { oldValue: any, newValue: any }): { [key: string]: any } => {
    const result: any = {};
    Object.keys(newValue).forEach((key: string) => {
        if (!oldValue.hasOwnProperty(key)) result[key] = newValue[key];
    });
    return result;
}

export const updatedKeysInJson = ({ oldValue = {}, newValue = {}, }: { oldValue: any, newValue: any }): { [key: string]: any } => {
    const result: any = {};
    Object.keys(oldValue).forEach((key: string) => {
        if (newValue[key] != oldValue[key]) result[key] = newValue[key];
    });
    return result;
}

export const deletedKeysInJson = ({ oldValue = {}, newValue = {}, }: { oldValue: any, newValue: any }): { [key: string]: any } => {
    const result: any = {};
    Object.keys(oldValue).forEach((key: string) => {
        if (!newValue.hasOwnProperty(key)) result[key] = oldValue[key];
    });
    return result;
}

export const isValidEmail = (email: string) => {
    // return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(email).toLowerCase()); // Alphanumeric check;
    return /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/.test(String(email).toLowerCase()); // Unicode check
}

export const isValidPhoneNumber = ({ phoneNumber, countryCode }: { phoneNumber: string, countryCode: CountryCode }): string | null => {
    const parsedPhoneNumber = parsePhoneNumber(phoneNumber, countryCode)
    if (parsedPhoneNumber && parsedPhoneNumber.isValid()) {
        return parsedPhoneNumber.number; // return like '+78005553535'
    }
    return null;
}

export const removePhoto = async (media: string) => {
    try {
        if (media) {
            let filePath = media.split('/').filter(o => o).join('/');
            console.log('Deleting file : ', filePath);
            if (filePath) {
                const bucket = getStorage().bucket();
                await bucket.file(filePath).delete();
                console.log('Deleted file : ', filePath);
            }
        }
    } catch (error) {
        console.error(error);
    }
};

export function generateRandomPassword(length: number = 8) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~`|}{[]\:;?><,./-=';

    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset.charAt(randomIndex);
    }

    return password;
}

export function isEmpty(obj: any) {
    if (!obj) return true;
    if (Array.isArray(obj)) {
        return obj.length === 0;
    }
    return Object.keys(obj).length === 0;
}


export function getDateIncrement(daysIncrement: number = 1): Date {
    const currentDate = new Date(); // Gets today's date
    currentDate.setDate(currentDate.getDate() + daysIncrement); // Adds daysIncrement days to the current date
    return currentDate;
}

export function findDeletedArrayItems<T>(oldArray?: T[], newArray?: T[]): T[] {
    const oldSet = new Set(oldArray || []);
    const newSet = new Set(newArray || []);

    return Array.from(oldSet).filter(item => !newSet.has(item));
}

export function getKeyForEmbeddingTexts(oid: string, agent: string) {
    return `EMBEDDING-TEXT-${oid}-AGENT-${agent}`;
}

export function getKeyForEmbeddingVectors(oid: string, agent: string) {
    return `EMBEDDING-VECTOR-${oid}-AGENT-${agent}`;
}


export function generateApiKey(length: number = 24) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let apiKey = '';
    for (let i = 0; i < length; i++) {
        apiKey += alphabet.charAt(randomInt(0, alphabet.length));
    }
    return apiKey;
}


