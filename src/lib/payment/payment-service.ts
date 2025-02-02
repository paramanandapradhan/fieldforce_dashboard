import { getAuthOrgId } from '$lib/auth/services/auth-service.svelte';
import { APP_ID } from '$lib/core/services/app-environment-service';
import { DatabaseService } from '$lib/database/database-service';
import { IdbWhere } from '@cloudparker/easy-idb';
import type { PaymentDataModel } from './payment-types';
import { alphabetNanoid } from '@cloudparker/moldex.js';


export enum PaymentStatusEnum {
	PENDING = 'p',
	FAILED = 'f',
	SUCCESS = 's'
}


class PaymentDatabaseService extends DatabaseService<PaymentDataModel> {
	// Indicates if sync is enabled
	protected syncEnabled: boolean = false;

	// Name of the Firestore collection
	protected collectionName: string = 'payments';

	// Private constructor to prevent direct instantiation
	constructor() {
		super();
	}

	// Constructs the Firestore collection path for agents
	public getFirestoreCollectionPath(): string {
		let path = `/a/${APP_ID}/o/${getAuthOrgId()}/${this.collectionName}`;
		return path;
	}

	public async createPayment(data: PaymentDataModel, id?: string) {
		return super.createFirestoreDoc(data, id);
	}

	public async updatePayment(id: string, data: PaymentDataModel) {
		return super.updateFirestoreDoc(id, data);
	}

	public async deletePayment(id: string) {
		return super.deleteFirestoreDocSoft(id);
	}

	public async getPayment(id: string) {
		return super.getOneLocal(id);
	}

	public async getAllPayments() {
		return this.findPaymentsLocal();
	}

	public async syncPayments() {
		return super.sync();
	}

	public async getPaymentCache(id: string) {
		return super.getOneCache(id);
	}

	protected async generateId(): Promise<string> {
		return alphabetNanoid();
	}

	protected async findPaymentsLocal() {
		let store = await this.getLocalDatabaseStore();
		let oid = getAuthOrgId();
		if (oid) {
			let whereKeys: string[] = ['oid'];
			let whereValue: any[] = [oid];

			let where = IdbWhere(whereKeys, '==', whereValue);
			let array = await store.find<PaymentDataModel>({ where })!;
			return array;
		}
		return [] as PaymentDataModel[];
	}
}

const paymentService = new PaymentDatabaseService();

export async function createPayment(data: PaymentDataModel, id?: string) {
	return paymentService.createPayment(data, id);
}

export async function updatePayment(id: string, data: PaymentDataModel) {
	return paymentService.updatePayment(id, data);
}

export async function deletePayment(id: string) {
	return paymentService.deletePayment(id);
}

export async function getPayment(id: string) {
	return paymentService.getPayment(id);
}

export async function getAllPayments() {
	return paymentService.getAllPayments();
}

export async function syncPayments() {
	return paymentService.syncPayments();
}

export async function getPaymentCache(id: string) {
	return paymentService.getPaymentCache(id);
}
