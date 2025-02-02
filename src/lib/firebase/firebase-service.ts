import type { FirebaseConfigType } from "$lib/auth/auth-types";
import { initializeApp, type FirebaseApp } from "firebase/app";
import { FIREBASE_API_KEY, FIREBASE_APP_ID, FIREBASE_AUTH_DOMAIN, FIREBASE_DATABASE_URL, FIREBASE_MEASURMENT_ID, FIREBASE_MESSAGING_SENDER_ID, FIREBASE_PROJECT_ID, FIREBASE_STORAGE_BUCKET, IS_DEV_ENV } from "../core/services/app-environment-service";


export let firebaseApp: FirebaseApp | null = null;


export function initFirebaseApp() {
    if (!firebaseApp) {
        const firebaseConfig: FirebaseConfigType = getDefaultFirebaseConfig();
        if (IS_DEV_ENV) {
            console.log(firebaseConfig)
        }
        // Init default app
        firebaseApp = initializeApp(firebaseConfig);

        if (IS_DEV_ENV) {
            console.log('Firebase App Initialized!');
        }

    }
}

export function getDefaultFirebaseConfig() {
    const firebaseConfig: FirebaseConfigType = {
        apiKey: FIREBASE_API_KEY,
        authDomain: FIREBASE_AUTH_DOMAIN,
        projectId: FIREBASE_PROJECT_ID,
        storageBucket: FIREBASE_STORAGE_BUCKET,
        messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
        appId: FIREBASE_APP_ID,
        measurementId: FIREBASE_MEASURMENT_ID,
        databaseURL: FIREBASE_DATABASE_URL
    };
    return firebaseConfig;
}
