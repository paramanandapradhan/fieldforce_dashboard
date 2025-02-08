import { getAuthOrgId } from '$lib/auth/services/auth-service.svelte';
import { APP_ID } from '$lib/core/services/app-environment-service';
import { DatabaseService } from '$lib/database/database-service';
import { IdbWhere } from '@cloudparker/easy-idb';
import type { RouteDataModel } from './route-types';
import { alphabetNanoid } from '@cloudparker/moldex.js';


export enum RouteStatusEnum {
	PENDING = 'p',
	FAILED = 'f',
	SUCCESS = 's'
}


class RouteDatabaseService extends DatabaseService<RouteDataModel> {
	// Indicates if sync is enabled
	protected syncEnabled: boolean = false;

	// Name of the Firestore collection
	protected collectionName: string = 'routes';

	// Private constructor to prevent direct instantiation
	constructor() {
		super();
	}

	// Constructs the Firestore collection path for agents
	public getFirestoreCollectionPath(): string {
		let path = `/a/${APP_ID}/o/${getAuthOrgId()}/${this.collectionName}`;
		return path;
	}

	public async createRoute(data: RouteDataModel, id?: string) {
		return super.createFirestoreDoc(data, id);
	}

	public async updateRoute(id: string, data: RouteDataModel) {
		return super.updateFirestoreDoc(id, data);
	}

	public async deleteRoute(id: string) {
		return super.deleteFirestoreDocSoft(id);
	}

	public async getRoute(id: string) {
		return super.getOneLocal(id);
	}

	public async getAllRoutes() {
		return this.findRoutesLocal();
	}

	public async syncRoutes() {
		return super.sync();
	}

	public async getRouteCache(id: string) {
		return super.getOneCache(id);
	}

	protected async generateId(): Promise<string> {
		return alphabetNanoid();
	}

	protected async findRoutesLocal() {
		let store = await this.getLocalDatabaseStore();
		let oid = getAuthOrgId();
		if (oid) {
			let whereKeys: string[] = ['oid'];
			let whereValue: any[] = [oid];

			let where = IdbWhere(whereKeys, '==', whereValue);
			let array = await store.find<RouteDataModel>({ where })!;
			return array;
		}
		return [] as RouteDataModel[];
	}
}

const routeService = new RouteDatabaseService();

export async function createRoute(data: RouteDataModel, id?: string) {
	return routeService.createRoute(data, id);
}

export async function updateRoute(id: string, data: RouteDataModel) {
	return routeService.updateRoute(id, data);
}

export async function deleteRoute(id: string) {
	return routeService.deleteRoute(id);
}

export async function getRoute(id: string) {
	return routeService.getRoute(id);
}

export async function getAllRoutes() {
	return routeService.getAllRoutes();
}

export async function syncRoutes() {
	return routeService.syncRoutes();
}

export async function getRouteCache(id: string) {
	return routeService.getRouteCache(id);
}
