
import { Database, type StoreDefinitionType } from '@cloudparker/easy-idb';
import { APP_DATABASE_NAME, APP_DATABASE_VERSION, IS_DEV_ENV } from '../core/services/app-environment-service';


import { stores } from '$lib/database/database.config';

class LocalDatabaseService extends Database {
    private static instance: LocalDatabaseService;
    private static dbOpenPromise: Promise<any>;

    // Private constructor to prevent direct instantiation
    private constructor() {
        super({ name: APP_DATABASE_NAME, version: parseInt(APP_DATABASE_VERSION || '1'), stores });
    }

    /**
     * Returns the singleton instance of the AppIndexedDbDatabase class.
     * If the instance does not exist or is not ready, it waits for the database to open.
     * 
     * @returns A {@link Promise} that resolves to the singleton instance of {@link AppIndexedDbDatabase}.
     */
    public static async getInstance(): Promise<LocalDatabaseService> {
        if (!this.instance) {
            this.instance = new LocalDatabaseService();
            this.dbOpenPromise = this.instance.openDatabase(); // Wait for the DB to be ready
        }

        if (this.dbOpenPromise) {
            await this.dbOpenPromise;
        }

        return this.instance;
    }

    /**
     * Opens the IndexedDB database and handles errors during the process.
     * 
     * If the database fails to open in a development environment, it attempts to delete the database and retry opening it.
     * In production environments, it logs an error message without attempting a retry.
     * 
     * @returns A {@link Promise} that resolves once the database is successfully opened, or retries in development mode if the operation fails.
     * 
     * @throws Will throw an error if the database cannot be opened and it's not recoverable in a non-development environment.
     */
    async openDatabase(): Promise<any> {
        try {
            return await super.openDatabase();
        } catch (error) {
            console.error(error);
            if (IS_DEV_ENV) {
                console.log('Error detected while openDatabase in DEV Env');
                if (indexedDB) {
                    const req = indexedDB.deleteDatabase(APP_DATABASE_NAME);
                    req.onsuccess = () => {
                        console.log('DB deleted');
                    };
                    req.onerror = () => {
                        console.error('Error on deleting db: ' + req.error);
                    };

                    // After Delete Retry to open
                    return await super.openDatabase();
                }
            } else {
                console.error('Error in database open, recheck your database version.');
            }
        } finally {
            if (IS_DEV_ENV) {
                console.log('Local database opened!')
            }
        }
    }

    /**
     * Clears all data from the stores defined in the database.
     * 
     * Iterates through each store defined in the database and removes all data from them.
     * 
     * @returns A {@link Promise} that resolves once all stores are cleared.
     * 
     * @throws Will throw an error if any store fails to remove its data.
     */
    async clearAll(): Promise<any[]> {
        let tasks: Promise<any>[] = [];
        stores.forEach((storeDef: StoreDefinitionType) => {
            let store = this.getStore(storeDef.name);
            if (store) {
                tasks.push(store.removeAll());
            }
        });
        return await Promise.all(tasks);
    }


}

let localDbService: LocalDatabaseService;

export async function initLocalDatabase() {
    localDbService = await LocalDatabaseService.getInstance();
    await localDbService.openDatabase()
}

export async function clearLocalDatabase() {
    localDbService?.clearAll();
}

export function getLocalDatabaseStore(name: string) {
    return localDbService?.getStore(name)
}