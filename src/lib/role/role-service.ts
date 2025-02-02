import { getAuthOrgId } from "$lib/auth/services/auth-service.svelte";
import { DatabaseService } from "$lib/database/database-service";
import { APP_ID } from "$lib/core/services/app-environment-service";
import type { RoleDataModel } from "./role-types";

export const ADMIN_ROLE_ID: string = '1';

class RoleDatabaseService extends DatabaseService<RoleDataModel> {

    // Indicates if sync is enabled
    protected syncEnabled: boolean = false;

    // Name of the Firestore collection
    protected collectionName: string = 'roles';

    constructor() {
        super();
    }

    // Constructs the Firestore collection path for roles
    public getFirestoreCollectionPath(): string {
        let path = `/a/${APP_ID}/o/${getAuthOrgId()}/${this.collectionName}`;
        return path;
    }

    public async createRole(data: RoleDataModel, id?: string) {
        return super.createFirestoreDoc(data, id);
    }

    public async updateRole(id: string, data: RoleDataModel) {
        return super.updateFirestoreDoc(id, data);
    }

    public async deleteRole(id: string) {
        return super.deleteFirestoreDocSoft(id);
    }

    public async getRole(id: string) {
        return super.getOneLocal(id);
    }

    public async getAllRoles() {
        return super.getAllLocal();
    }

    public async syncRoles() {
        return super.sync();
    }

    public async getRoleCache(id: string) {
        return super.getOneCache(id)
    }


}


const roleService = new RoleDatabaseService();

export async function createRole(data: RoleDataModel, id?: string) {
    return roleService.createRole(data, id);
}

export async function updateRole(id: string, data: RoleDataModel) {
    return roleService.updateRole(id, data);
}

export async function deleteRole(id: string) {
    return roleService.deleteRole(id);
}

export async function getRole(id: string) {
    return roleService.getRole(id);
}

export async function getAllRoles() {
    return roleService.getAllRoles();
}

export async function syncRoles() {
    return roleService.syncRoles();
}

export async function getRoleCache(id: string) {
    return roleService.getRoleCache(id)
}
