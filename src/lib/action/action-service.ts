import { getAuthOrgId } from '$lib/auth/services/auth-service.svelte';
import { APP_ID } from '$lib/core/services/app-environment-service';
import { DatabaseService } from '$lib/database/database-service';
import { IdbWhere } from '@cloudparker/easy-idb';
import type { ActionDataModel } from './action-types';

class ActionDatabaseService extends DatabaseService<ActionDataModel> {
	// Indicates if sync is enabled
	protected syncEnabled: boolean = false;

	// Name of the Firestore collection
	protected collectionName: string = 'actions';

	constructor() {
		super();
	}

	// Constructs the Firestore collection path for Actions
	public getFirestoreCollectionPath(): string {
		let path = `/a/${APP_ID}/o/${getAuthOrgId()}/${this.collectionName}`;
		return path;
	}

	public async createAction(data: ActionDataModel, id?: string) {
		return super.createFirestoreDoc(data, id);
	}

	public async updateAction(id: string, data: ActionDataModel) {
		return super.updateFirestoreDoc(id, data);
	}

	public async deleteAction(id: string) {
		return super.deleteFirestoreDocSoft(id);
	}

	public async getAction(id: string) {
		return super.getOneLocal(id);
	}

	public async getAllActions({agent}:{agent?:string}) {
		return this.findActionsLocal({agent});
	}

	public async syncActions() {
		return super.sync();
	}

	public async getActionCache(id: string) {
		return super.getOneCache(id);
	}

	protected async findActionsLocal({agent}:{agent?:string}) {
		let store = await this.getLocalDatabaseStore();
		let oid = getAuthOrgId();
		if (oid) {
			let whereKeys: string[] = ['oid'];
			let whereValue: any[] = [oid];
			
			if (agent) {
                whereKeys.push('agent');
                whereValue.push(agent)
            }
			let where = IdbWhere(whereKeys, '==', whereValue);
			let array = await store.find<ActionDataModel>({ where })!;
			return array;
		}
		return [] as ActionDataModel[];
	}
}

const ActionService = new ActionDatabaseService();

export async function createAction(data: ActionDataModel, id?: string) {
	return ActionService.createAction(data, id);
}

export async function updateAction(id: string, data: ActionDataModel) {
	return ActionService.updateAction(id, data);
}

export async function deleteAction(id: string) {
	return ActionService.deleteAction(id);
}

export async function getAction(id: string) {
	return ActionService.getAction(id);
}

export async function getAllActions({agent}:{agent?:string}) {
	return ActionService.getAllActions({agent});
}

export async function syncActions() {
	return ActionService.syncActions();
}

export async function getActionCache(id: string) {
	return ActionService.getActionCache(id);
}
