import { getAuthOrgId } from '$lib/auth/services/auth-service.svelte';
import { APP_ID } from '$lib/core/services/app-environment-service';
import { DatabaseService } from '$lib/database/database-service';
import { IdbWhere } from '@cloudparker/easy-idb';
import type { ProductDataModel } from './product-type';

class ProductDatabaseService extends DatabaseService<ProductDataModel> {
	// Indicates if sync is enabled
	protected syncEnabled: boolean = false;

	// Name of the Firestore collection
	protected collectionName: string = 'products';

	// Private constructor to prevent direct instantiation
	constructor() {
		super();
	}

	// Constructs the Firestore collection path for agents
	public getFirestoreCollectionPath(): string {
		let path = `/a/${APP_ID}/o/${getAuthOrgId()}/${this.collectionName}`;
		return path;
	}

	public async createProduct(data: ProductDataModel, id?: string) {
		return super.createFirestoreDoc(data, id);
	}

	public async updateProduct(id: string, data: ProductDataModel) {
		return super.updateFirestoreDoc(id, data);
	}

	public async deleteProduct(id: string) {
		return super.deleteFirestoreDocSoft(id);
	}

	public async getProduct(id: string) {
		return super.getOneLocal(id);
	}

	public async getAllProducts() {
		return this.findProductsLocal();
	}

	public async syncProducts() {
		return super.sync();
	}

	public async getProductCache(id: string) {
		return super.getOneCache(id);
	}

	protected async findProductsLocal() {
		let store = await this.getLocalDatabaseStore();
		let oid = getAuthOrgId();
		if (oid) {
			let whereKeys: string[] = ['oid'];
			let whereValue: any[] = [oid];

			let where = IdbWhere(whereKeys, '==', whereValue);
			let array = await store.find<ProductDataModel>({ where })!;
			return array;
		}
		return [] as ProductDataModel[];
	}
}

const routeService = new ProductDatabaseService();

export async function createProduct(data: ProductDataModel, id?: string) {
	return routeService.createProduct(data, id);
}

export async function updateProduct(id: string, data: ProductDataModel) {
	return routeService.updateProduct(id, data);
}

export async function deleteProduct(id: string) {
	return routeService.deleteProduct(id);
}

export async function getProduct(id: string) {
	return routeService.getProduct(id);
}

export async function getAllProducts() {
	return routeService.getAllProducts();
}

export async function syncProducts() {
	return routeService.syncProducts();
}

export async function getProductCache(id: string) {
	return routeService.getProductCache(id);
}
