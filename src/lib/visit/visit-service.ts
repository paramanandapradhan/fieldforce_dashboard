import { getAuthOrgId } from '$lib/auth/services/auth-service.svelte';
import { APP_ID } from '$lib/core/services/app-environment-service';
import { DatabaseService } from '$lib/database/database-service';
import { IdbWhere } from '@cloudparker/easy-idb';
import type { VisitDataModel } from './visite-type';


class VisitDatabaseService extends DatabaseService<VisitDataModel> {
	// Indicates if sync is enabled
	protected syncEnabled: boolean = false;

	// Name of the Firestore collection
	protected collectionName: string = 'visits';

	// Private constructor to prevent direct instantiation
	constructor() {
		super();
	}

	// Constructs the Firestore collection path for agents
	public getFirestoreCollectionPath(): string {
		let path = `/a/${APP_ID}/o/${getAuthOrgId()}/${this.collectionName}`;
		return path;
	}

	public async createVisit(data: VisitDataModel, id?: string) {
		return super.createFirestoreDoc(data, id);
	}

	public async updateVisit(id: string, data: VisitDataModel) {
		return super.updateFirestoreDoc(id, data);
	}

	public async deleteVisit(id: string) {
		return super.deleteFirestoreDocSoft(id);
	}

	public async getVisit(id: string) {
		return super.getOneLocal(id);
	}

	public async getAllVisits() {
		return this.findVisitsLocal();
	}

	public async syncVisits() {
		return super.sync();
	}

	public async getVisitCache(id: string) {
		return super.getOneCache(id);
	}

	protected async findVisitsLocal() {
		let store = await this.getLocalDatabaseStore();
		let oid = getAuthOrgId();
		if (oid) {
			let whereKeys: string[] = ['oid'];
			let whereValue: any[] = [oid];

			let where = IdbWhere(whereKeys, '==', whereValue);
			let array = await store.find<VisitDataModel>({ where })!;
			return array;
		}
		return [] as VisitDataModel[];
	}
}

const routeService = new VisitDatabaseService();

export async function createVisit(data: VisitDataModel, id?: string) {
	return routeService.createVisit(data, id);
}

export async function updateVisit(id: string, data: VisitDataModel) {
	return routeService.updateVisit(id, data);
}

export async function deleteVisit(id: string) {
	return routeService.deleteVisit(id);
}

export async function getVisit(id: string) {
	return routeService.getVisit(id);
}

export async function getAllVisits() {
	return routeService.getAllVisits();
}

export async function syncVisits() {
	return routeService.syncVisits();
}

export async function getVisitCache(id: string) {
	return routeService.getVisitCache(id);
}
