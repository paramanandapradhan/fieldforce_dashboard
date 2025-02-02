import type { FirebaseConfigType } from "$lib/auth/auth-types";
import { AppService } from "$lib/core/services/app-service";
import { getDefaultFirebaseConfig } from "./firebase-service";

 
export const KEY_DEVICE_TOKEN = 'device.token';
export const KEY_REGISTER_FCM = 'register.fcm';

export function getDeviceTokenKey(oid: string) {
    return `${KEY_DEVICE_TOKEN}.${oid || ''}`;
};

export function initFcm() {
    let firebaseConfig: FirebaseConfigType = getDefaultFirebaseConfig();
    if (AppService.getInstance().hasNotificationPermission()) {
        // let app = getApp(org.id)
        // if (!app) {
        //     app = initializeApp(firebaseConfig, org.id)
        // }
        // const messaging = getMessaging(app);
        // // let deviceToken = localStorage.getItem(getDeviceTokenKey(org.id));
        // let deviceToken = await getToken(messaging, { vapidKey: org.fbVapidKey })
        // if (!deviceToken) {
        //     try {
        //         console.log('Request new Device Token')
        //         deviceToken = await getToken(messaging, { vapidKey: org.fbVapidKey })
        //         if (deviceToken) {
        //             localStorage.setItem(getDeviceTokenKey(org.id), deviceToken)
        //         }
        //     } catch (error) {
        //         console.error(error);
        //     }
        // }
        // if (deviceToken) {
        //     console.log(`deviceToken of ${org.id}`, deviceToken);
        //     // Save Device token to server
        //     // then onMessage Foreground
        //     // console.log('Listening forground messages : onMessage');
        //     onMessage(messaging, (payload) => {
        //         handleMessage(payload);
        //     });

        //     // register background message receiver
        //     registerBacgroundReceiver(firebaseConfig, org.id);
        // }
    }
}



export function clearFcmToken() {
    const token = localStorage.getItem('fcm');
    if (token) {
        // Remove torken form server
    }
    localStorage.removeItem('fcm');
}

function handleMessage(payload: any) {
    console.log('Message received. onMessage ', payload);
    new Notification("New Message deceived");
}

function registerBacgroundReceiver(firebaseConfig: FirebaseConfigType, oid: string) {
    navigator.serviceWorker.ready.then((registration) => {
        // console.log('navigator.serviceWorker.ready', registration, navigator.serviceWorker)
        if (navigator.serviceWorker && navigator.serviceWorker.controller) {
            // console.log('Registering fcm backgrond receiver : postMessage')
            navigator.serviceWorker.controller.postMessage({
                type: KEY_REGISTER_FCM,
                firebaseConfig,
                oid
            });
        }
    });
}