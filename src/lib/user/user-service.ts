import { getAuthOrgId } from "$lib/auth/services/auth-service.svelte";
import { DatabaseService } from "$lib/database/database-service";
import { APP_ID } from "$lib/core/services/app-environment-service";
import { IdbWhere } from "@cloudparker/easy-idb";
import { type UserDataModel, type CustomerDataModel, UserTypeEnum, } from "./user-types";


export const CUSTOMER_TYPES = [
    { _id: UserTypeEnum.USER_TYPE_CUSTOMER, name: 'Customer' },
    { _id: UserTypeEnum.USER_TYPE_DISTRIBUTOR, name: 'Distributor' },
    { _id: UserTypeEnum.USER_TYPE_RETAILER, name: 'Retailer' },
]

class UserDatabaseService extends DatabaseService<UserDataModel | CustomerDataModel> {

    // Indicates if sync is enabled
    protected syncEnabled: boolean = false;

    // Name of the Firestore collection
    protected collectionName: string = 'users';

    // Private constructor to prevent direct instantiation
    constructor() {
        super();
    }

    // Constructs the Firestore collection path for users
    public getFirestoreCollectionPath(): string {
        let path = `/a/${APP_ID}/o/${getAuthOrgId()}/${this.collectionName}`;
        return path;
    }

    public async createUser(data: UserDataModel | CustomerDataModel, id?: string) {
        return super.createFirestoreDoc(data, id);
    }

    public async updateUser(id: string, data: UserDataModel | CustomerDataModel) {
        return super.updateFirestoreDoc(id, data);
    }

    public async deleteUser(id: string) {
        return super.deleteFirestoreDocSoft(id);
    }

    public async getUser(id: string) {
        return super.getOneLocal(id);
    }

    public async getAllUsers({ type }: { type?: UserTypeEnum }) {
        return this.findUsersLocal({ type })
    }

    public async syncUsers() {
        return super.sync();
    }

    public async getUserCache(id: string) {
        return super.getOneCache(id)
    }

    protected async findUsersLocal({ type }: { type?: UserTypeEnum }) {
        let store = await this.getLocalDatabaseStore();
        let oid = getAuthOrgId();
        if (oid) {
            let whereKeys: string[] = ['oid'];
            let whereValue: any[] = [oid];
            if (type) {
                whereKeys.push('type');
                whereValue.push(type)
            }
            let where = IdbWhere(whereKeys, "==", whereValue);
            let array = await store.find<UserDataModel | CustomerDataModel>({ where })!;
            return array;
        }
        return [] as UserDataModel | CustomerDataModel[];
    }

}


const userService = new UserDatabaseService();

export async function createUser(data: UserDataModel | CustomerDataModel, id?: string) {
    return userService.createUser(data, id);
}

export async function updateUser(id: string, data: UserDataModel | CustomerDataModel) {
    return userService.updateUser(id, data);
}

export async function deleteUser(id: string) {
    return userService.deleteUser(id);
}

export async function getUser(id: string) {
    return userService.getUser(id);
}

export async function getAllUsers({ type }: { type?: UserTypeEnum } = {}) {
    return userService.getAllUsers({ type });
}

export async function syncUsers() {
    return userService.syncUsers();
}

export async function getUserCache(id: string) {
    return userService.getUserCache(id)
}
