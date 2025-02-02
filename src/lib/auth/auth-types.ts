
export class FirebaseAuthStatesEnum {
    static UNKNOWN = 1;
    static SIGNIN = 2;
    static SIGNOUT = 3
};


export type firebaseAuthUserIdentityType = {
    id?: string;
    phone?: string;
    email?: string;
    name?: string;
    photo?: string;
}

export type FirebaseAuthClaimsType = {
    _id?: string;
    phone?: string;
    phone_number?: string;
    email?: string;
    name?: string;
    displayName?: string;
    photo?: string;
    aud?: string;
    user_id?: string;
    auth_time?: string;
    email_verified?: boolean;
    exp?: string;
    iat?: string;
    sub?: string;
    iss?: string;
    firebase?: any;

    /**
    * Is User root admin
    */
    ur?: boolean;

    /**
     * Is User support
     */
    us?: boolean;

    /**
     * Is User Anonymous
     */
    ua?: boolean;

    /**
     * map of organizations and it users and role
     */
    orgs?: { [key: string]: { [key: string]: string } },

    /**
     * Active Organization Id
     */
    oid?: string;

    /**
     * Active Organization USer Id, User id from user collection.
     */
    ouid?: string;

    /**
     * Active Role id
     */
    rid?: string;

    /**
     * Scope of the login user, feature_id and Permission map.
     */
    scp?: { [key: string]: number };

    _orgs?: OrgUserRoleMapType[],
}

export type OrgUserRoleMapType = {
    _oid: string,
    _users: {
        _uid: string,
        _rid: string
    }[]
}

export type FirebaseConfigType = {
    apiKey: string,
    authDomain: string,
    projectId: string,
    storageBucket: string,
    messagingSenderId: string,
    appId: string,
    measurementId: string,
    databaseURL: string,
}

