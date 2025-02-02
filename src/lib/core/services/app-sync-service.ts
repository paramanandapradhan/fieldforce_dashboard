import { showToast } from "@cloudparker/moldex.js";
 
import type { SyncListenerFunction } from "../types/app-types";
import { getAuthOrgUserId } from "$lib/auth/services/auth-service.svelte";


const KEY_LAST_SYNC_TIME = 'last.sync.time';
const SYNC_WINDOW = 10 * 60 * 1000; // 10 mins = millis

let isInitalAppSyncCompleted = false;
let syncListeners: SyncListenerFunction[] = [];

/**
 * Initiates data synchronization with the remote server. 
 * It checks the last sync time and starts synchronization if the time elapsed exceeds the default sync window (Default: 10 mins); 
 * otherwise, it skips the sync process. 
 * Programmers have the option to forcibly start data synchronization by enabling the force flag in this function.
 * 
 * @param force Flag to forcibly start the synchronization service
 * 
 */
export async function startSyncRemoteData(force?: boolean) {
    let lastSyncTime = 0;
    try {
        lastSyncTime = parseInt(localStorage.getItem(KEY_LAST_SYNC_TIME) || '0');
    } catch (error) {
        localStorage.setItem(KEY_LAST_SYNC_TIME, '0');
    }

    let isValidSyncTimeing = (Date.now() - lastSyncTime) > SYNC_WINDOW;
    if ( getAuthOrgUserId() && ((!isInitalAppSyncCompleted && isValidSyncTimeing) || force)) {
        isInitalAppSyncCompleted = true;
        localStorage.setItem(KEY_LAST_SYNC_TIME, '' + Date.now());
        let tasks: any[] = [];
        if (syncListeners?.length) {
            tasks = syncListeners.map(async (listener: SyncListenerFunction) => {
                await listener();
            })
        }
        await Promise.all(tasks)
        console.log('Sync done.')
    }
}

/**
 * Registers a synchronization listener. This listener provides a callback when the app's synchronization process starts.
 * Utilize this listener to manage data synchronization with the remote server; ensure all app data services register it.
 * 
 * @param listener The listener function to add
 * 
 */
export function registerSyncListener(listener: SyncListenerFunction) {
    if (listener) {
        if (syncListeners.indexOf(listener) < 0) {
            syncListeners.push(listener);
        }
    }
}

/**
 * Removes the specified listeners from the synchronization listeners list.
 */
export function unregisterSyncListener(listener: SyncListenerFunction) {
    if (listener) {
        let index = syncListeners.indexOf(listener);
        if (index >= 0) {
            syncListeners.splice(index, 1);
        }
    }
}

/**
 * Initiates application synchronization and updates the UI as necessary.
 */
export async function showAppSyncUI() {
    showToast({ msg: 'Sync Started' });
    await startSyncRemoteData(true);
    setTimeout(() => {
        location.reload();
    }, 300);
}
