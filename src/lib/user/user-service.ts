import { getAuthOrgId } from "$lib/auth/services/auth-service.svelte";
import { DatabaseService } from "$lib/database/database-service";
import { APP_ID } from "$lib/core/services/app-environment-service";
import { IdbWhere } from "@cloudparker/easy-idb";
import { type UserDataModel, type CustomerDataModel, UserTypeEnum, UserSubtypeEnum, } from "./user-types";


export const USER_SUBTYPES = [
    { _id: UserSubtypeEnum.USER_SUBTYPE_USER_STAFF, name: 'Staff' },
    { _id: UserSubtypeEnum.USER_SUBTYPE_USER_SM, name: 'SM' },
    { _id: UserSubtypeEnum.USER_SUBTYPE_USER_TSM, name: 'TSM' },
    { _id: UserSubtypeEnum.USER_SUBTYPE_USER_DISTRIBUTOR, name: 'Distributor' },
]

export const CUSTOMER_SUBTYPES = [
    { _id: UserSubtypeEnum.USER_SUBTYPE_CUSTOMER_CONSUMER, name: 'Consumer' },
    { _id: UserSubtypeEnum.USER_SUBTYPE_CUSTOMER_RETAILER, name: 'Retailer' },
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

    public async getAllUsers({ type, subtype }: { type?: UserTypeEnum, subtype?: UserSubtypeEnum } = {}) {
        return this.findUsersLocal({ type, subtype })
    }

    public async syncUsers() {
        return super.sync();
    }

    public async getUserCache(id: string) {
        return super.getOneCache(id)
    }

    protected async findUsersLocal({ type, subtype }: { type?: UserTypeEnum, subtype?: UserSubtypeEnum } = {}) {
        let store = await this.getLocalDatabaseStore();
        let oid = getAuthOrgId();
        if (oid) {
            let whereKeys: string[] = ['oid'];
            let whereValue: any[] = [oid];
            if (type) {
                whereKeys.push('type');
                whereValue.push(type)
            }
            if (subtype) {
                whereKeys.push('subtype');
                whereValue.push(subtype)
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

export async function getAllUsers({ type, subtype }: { type?: UserTypeEnum, subtype?: UserSubtypeEnum } = {}) {
    return userService.getAllUsers({ type, subtype });
}

export async function syncUsers() {
    return userService.syncUsers();
}

export async function getUserCache(id: string) {
    return userService.getUserCache(id)
}
