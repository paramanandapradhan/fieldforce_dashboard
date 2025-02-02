import { getAuthOrgId } from '$lib/auth/services/auth-service.svelte';
import { APP_ID } from '$lib/core/services/app-environment-service';
import { DatabaseService } from '$lib/database/database-service';
import { IdbWhere } from '@cloudparker/easy-idb';
import type { InvoiceDataModel } from './invoice-types';

class InvoiceDatabaseService extends DatabaseService<InvoiceDataModel> {
	// Indicates if sync is enabled
	protected syncEnabled: boolean = false;

	// Name of the Firestore collection
	protected collectionName: string = 'invoices';

	// Private constructor to prevent direct instantiation
	constructor() {
		super();
	}

	// Constructs the Firestore collection path for agents
	public getFirestoreCollectionPath(): string {
		let path = `/a/${APP_ID}/o/${getAuthOrgId()}/${this.collectionName}`;
		return path;
	}

	public async createInvoice(data: InvoiceDataModel, id?: string) {
		return super.createFirestoreDoc(data, id);
	}

	public async updateInvoice(id: string, data: InvoiceDataModel) {
		return super.updateFirestoreDoc(id, data);
	}

	public async deleteInvoice(id: string) {
		return super.deleteFirestoreDocSoft(id);
	}

	public async getInvoice(id: string) {
		return super.getOneLocal(id);
	}

	public async getAllInvoices() {
		return this.findInvoicesLocal();
	}

	public async syncInvoices() {
		return super.sync();
	}

	public async getInvoiceCache(id: string) {
		return super.getOneCache(id);
	}

	protected async findInvoicesLocal() {
		let store = await this.getLocalDatabaseStore();
		let oid = getAuthOrgId();
		if (oid) {
			let whereKeys: string[] = ['oid'];
			let whereValue: any[] = [oid];

			let where = IdbWhere(whereKeys, '==', whereValue);
			let array = await store.find<InvoiceDataModel>({ where })!;
			return array;
		}
		return [] as InvoiceDataModel[];
	}
}

const invoiceService = new InvoiceDatabaseService();

export async function createInvoice(data: InvoiceDataModel, id?: string) {
	return invoiceService.createInvoice(data, id);
}

export async function updateInvoice(id: string, data: InvoiceDataModel) {
	return invoiceService.updateInvoice(id, data);
}

export async function deleteInvoice(id: string) {
	return invoiceService.deleteInvoice(id);
}

export async function getInvoice(id: string) {
	return invoiceService.getInvoice(id);
}

export async function getAllInvoices() {
	return invoiceService.getAllInvoices();
}

export async function syncInvoices() {
	return invoiceService.syncInvoices();
}

export async function getInvoiceCache(id: string) {
	return invoiceService.getInvoiceCache(id);
}
