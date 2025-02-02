import { CountryCode } from 'libphonenumber-js';
import { v4 as uuidv4 } from 'uuid';

import { createAuthUser, getAuthUserByEmail, getAuthUserByPhoneNumber, getAuthUserByUid, getOrCreateAuthUserByEmail, getOrCreateAuthUserByPhone, createAnonymousToken, updateAuthUserRoleAccessClaims } from '../services/auth.service';
import { UserIdentityDataModel, } from '../types/types';
import { isValidEmail, isValidPhoneNumber } from '../utils/utils';
import {
    AUTH_COMMAND_ANONYMOUS_TOKEN,
    AUTH_COMMAND_CREATE_USER,
    AUTH_COMMAND_GET_OR_CREATE_USER,
    AUTH_COMMAND_GET_USER,
    AUTH_COMMAND_GET_USER_BY_UID,
    AUTH_COMMAND_SWITCH_USER,
    AUTH_COMMAND_VALIDATE_EMAIL,
    AUTH_COMMAND_VALIDATE_PHONE_NUMBER
} from '../utils/auth-commands';
import { onCall, HttpsError } from 'firebase-functions/v2/https';


// export const onCreateAuthUser = auth.user()
//     .onCreate(async (user: UserRecord, context: EventContext) => {
//         // const uid = user.uid;
//         // const tasks = [
//         //     // createUsersAccessesDoc({ uid }),
//         //     // createUserDoc({ uid, name: user.displayName, photo: user.photoURL }),
//         //     // createUsersIdentiesDoc({ uid, email: user.email, phoneNumber: user.phoneNumber }),
//         // ];
//         // await Promise.all(tasks);
//     });

let corsDev = [
    "https://dev-app.hellocall.ai",
    "https://app.hellocall.ai",
    "http://localhost:4040",
];
let corsProd = [
    "https://app.hellocall.ai",
];
let cors: string | string[] | boolean = corsDev;
if (process.env.VITE_ENVIRONMENT == 'prod') {
    cors = corsProd;
}

// Disable on PROD
// Allow all origin
// cors = true;

console.log('appAuthCommands CORS', process.env.VITE_ENVIRONMENT, cors);
export const appAuthCommands = onCall({ cors: cors }, async (request) => {
    const command: string = request.data.command;
    const payload: UserIdentityDataModel = request.data.payload || {};

    console.log('appAuthCommands', { command, payload });

    // Unauthenticated Commands
    switch (command) {
        case AUTH_COMMAND_VALIDATE_PHONE_NUMBER:
            return validatePhoneNumber({ phoneNumber: payload.phone, countryCode: payload.countryCode });
        case AUTH_COMMAND_VALIDATE_EMAIL:
            return validateEmail(payload.email);
        case AUTH_COMMAND_ANONYMOUS_TOKEN:
            payload.fuid = payload.fuid || `anonymous:${uuidv4()}`;
            payload.displayName = payload.displayName || `Anonymous`;
            return createAnonymousToken(payload);
    }

    if (!request.auth || !request.auth?.uid) {
        throw new HttpsError('unauthenticated', `Restricted access`);
    }

    if (request.auth.uid !== payload.fuid) {
        throw new HttpsError('unauthenticated', `Restricted access, uid mismatch.`);
    }

    // Authenticated Commands
    switch (command) {
        case AUTH_COMMAND_GET_USER_BY_UID:
            return getUserByUid({ fuid: payload.fuid });
        case AUTH_COMMAND_CREATE_USER:
            if (payload.email) payload.email = validateEmail(payload.email);
            if (payload.phone) payload.phone = validatePhoneNumber({ phoneNumber: payload.phone, countryCode: payload.countryCode });
            return createAuthUser({ ...payload });
        case AUTH_COMMAND_GET_USER:
            if (payload.email) {
                const email = validateEmail(payload.email);
                return getUserByEmail({ email });
            } else if (payload.phone) {
                const phoneNumber = validatePhoneNumber({ phoneNumber: payload.phone, countryCode: payload.countryCode });
                if (phoneNumber) {
                    return getUserByPhoneNumber({ phoneNumber });
                }
            }
            break;
        case AUTH_COMMAND_GET_OR_CREATE_USER:
            if (payload.email) {
                const email = validateEmail(payload.email);
                return getOrCreateUserByEmail({ email, password: payload.password });
            } else if (payload.phone) {
                const phoneNumber = validatePhoneNumber({ phoneNumber: payload.phone, countryCode: payload.countryCode });
                if (phoneNumber) {
                    return await getOrCreateUserByPhone({ phoneNumber });
                }
            }
            break;
        case AUTH_COMMAND_SWITCH_USER:
            return switchUser({ fuid: payload.fuid!, oid: payload.oid!, uid: payload.uid!, rid: payload.rid! })
        default:
            throw new HttpsError('unimplemented', `Command not found`);
    }

    return null;
});

const validateEmail = (email?: string): string => {
    if (email) {
        let isValid = isValidEmail(email);
        if (isValid) {
            return email;
        } else {
            throw new HttpsError('invalid-argument', `Invalid email`);
        }
    } else {
        throw new HttpsError('invalid-argument', `Missing email`);
    }
}


const validatePhoneNumber = ({ phoneNumber, countryCode }: { phoneNumber?: string, countryCode?: CountryCode }): string => {
    if (phoneNumber) {
        if (countryCode) {
            const number = isValidPhoneNumber({ phoneNumber, countryCode });
            if (number) {
                return number;
            } else {
                throw new HttpsError('invalid-argument', `Invalid phone number`);
            }
        } else {
            throw new HttpsError('invalid-argument', `countryCode is missing in the request body (eg. 'IN')`)
        }
    } else {
        throw new HttpsError('invalid-argument', `Missing phoneNumber`);
    }
}

const getUserByUid = async ({ fuid }: { fuid?: string }) => {
    if (fuid) {
        try {
            return await getAuthUserByUid({ fuid });
        } catch (error) {
            throw new HttpsError('not-found', 'User not found');
        }
    }
    throw new HttpsError('invalid-argument', 'Missing required field(s).');
}

const getUserByPhoneNumber = async ({ phoneNumber }: { phoneNumber: string }) => {
    if (phoneNumber) {
        try {
            return await getAuthUserByPhoneNumber({ phoneNumber });
        } catch (error) {
            throw new HttpsError('not-found', 'User not found');
        }
    }
    throw new HttpsError('invalid-argument', 'Missing required field(s).');
}

const getOrCreateUserByPhone = async ({ phoneNumber }: { phoneNumber: string }) => {
    if (phoneNumber) {
        try {
            return await getOrCreateAuthUserByPhone({ phoneNumber })
        } catch (error) {
            throw new HttpsError('not-found', 'User not found');
        }
    }
    throw new HttpsError('invalid-argument', 'Missing required field(s).');
}


const getUserByEmail = async ({ email }: { email: string }) => {
    if (email) {
        try {
            return await getAuthUserByEmail({ email });
        } catch (error) {
            throw new HttpsError('not-found', 'User not found');
        }
    }
    throw new HttpsError('invalid-argument', 'Missing required field(s).');
}


const getOrCreateUserByEmail = async ({ email, password }: { email: string, password?: string }) => {
    if (email) {
        try {
            return await getOrCreateAuthUserByEmail({ email, password })
        } catch (error) {
            throw new HttpsError('not-found', 'User not found');
        }
    }
    throw new HttpsError('invalid-argument', 'Missing required field(s).');
}

const switchUser = async ({ fuid, oid, uid, rid }: { fuid: string, oid: string, uid: string, rid: string }) => {
    if (fuid && oid && uid && rid) {
        try {
            let result = await updateAuthUserRoleAccessClaims({ fuid, oid, uid, rid });
            if (result) {
                return { message: "Success", data: { fuid, oid, uid, rid } }
            } else {
                throw new HttpsError('invalid-argument', 'Unable to swithc the user, validate requested data carefully!');
            }
        } catch (error) {
            throw new HttpsError('invalid-argument', 'Unable to switch the user');
        }
    }
    throw new HttpsError('invalid-argument', 'Missing required field(s).');
}



