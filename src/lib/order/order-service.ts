import { getAuthOrgId } from '$lib/auth/services/auth-service.svelte';
import { APP_ID } from '$lib/core/services/app-environment-service';
import { DatabaseService } from '$lib/database/database-service';
import { IdbWhere } from '@cloudparker/easy-idb';
import type { OrderDataModel } from './order-type';

class OrderDatabaseService extends DatabaseService<OrderDataModel> {
	// Indicates if sync is enabled
	protected syncEnabled: boolean = false;

	// Name of the Firestore collection
	protected collectionName: string = 'orders';

	// Private constructor to prevent direct instantiation
	constructor() {
		super();
	}

	// Constructs the Firestore collection path for agents
	public getFirestoreCollectionPath(): string {
		let path = `/a/${APP_ID}/o/${getAuthOrgId()}/${this.collectionName}`;
		return path;
	}

	public async createOrder(data: OrderDataModel, id?: string) {
		return super.createFirestoreDoc(data, id);
	}

	public async updateOrder(id: string, data: OrderDataModel) {
		return super.updateFirestoreDoc(id, data);
	}

	public async deleteOrder(id: string) {
		return super.deleteFirestoreDocSoft(id);
	}

	public async getOrder(id: string) {
		return super.getOneLocal(id);
	}

	public async getAllOrders() {
		return this.findOrdersLocal();
	}

	public async syncOrders() {
		return super.sync();
	}

	public async getOrderCache(id: string) {
		return super.getOneCache(id);
	}

	protected async findOrdersLocal() {
		let store = await this.getLocalDatabaseStore();
		let oid = getAuthOrgId();
		if (oid) {
			let whereKeys: string[] = ['oid'];
			let whereValue: any[] = [oid];

			let where = IdbWhere(whereKeys, '==', whereValue);
			let array = await store.find<OrderDataModel>({ where })!;
			return array;
		}
		return [] as OrderDataModel[];
	}
}

const routeService = new OrderDatabaseService();

export async function createOrder(data: OrderDataModel, id?: string) {
	return routeService.createOrder(data, id);
}

export async function updateOrder(id: string, data: OrderDataModel) {
	return routeService.updateOrder(id, data);
}

export async function deleteOrder(id: string) {
	return routeService.deleteOrder(id);
}

export async function getOrder(id: string) {
	return routeService.getOrder(id);
}

export async function getAllOrders() {
	return routeService.getAllOrders();
}

export async function syncOrders() {
	return routeService.syncOrders();
}

export async function getOrderCache(id: string) {
	return routeService.getOrderCache(id);
}
