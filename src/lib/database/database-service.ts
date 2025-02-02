import { getAuthOrgId, getAuthOrgUserId } from '$lib/auth/services/auth-service.svelte';
import { createRtdbNumberId } from '$lib/firebase/rtdb-service';
import { IdbWhere, type Store, type WhereConstraint } from '@cloudparker/easy-idb';
import { delay, timestampToDate } from '@cloudparker/moldex.js';
import {
	collection,
	deleteDoc,
	doc,
	getCountFromServer,
	getDoc,
	getDocs,
	getFirestore,
	orderBy,
	Query,
	query,
	QueryConstraint,
	QuerySnapshot,
	serverTimestamp,
	setDoc,
	updateDoc,
	where,
	type DocumentData
} from 'firebase/firestore';
import { APP_TTL_DAYS, IS_DEV_ENV } from '../core/services/app-environment-service';
import type { BaseDataModel } from '../core/types/app-types';
import { getLocalDatabaseStore } from './local-database-service';
import { getDateDayIncrement } from '$lib/core/services/app-utils-service';



export abstract class DatabaseService<T extends BaseDataModel> {
	protected abstract collectionName: string;
	protected syncEnabled: boolean = true;
	private static CACHE: { [key: string]: any } = {};

	protected constructor() {
	}

	protected async getLocalDatabaseStore(): Promise<Store> {
		return getLocalDatabaseStore(this.collectionName)!;
	}

	/**
	 * Generates a unique identifier for use as a document ID.
	 *
	 * @returns A {@link Promise} that resolves to a unique string identifier (UUID).
	 */
	protected async createFirestoreId(): Promise<string> {
		let id = await createRtdbNumberId({ oid: getAuthOrgId(), key: this.collectionName });
		return id;
	}

	/**
	 * Generates a unique identifier for use as a document ID.
	 *
	 * @returns A {@link Promise} that resolves to a unique string identifier (UUID).
	 */
	protected async generateId(): Promise<string> {
		return this.createFirestoreId();
	}

	/**
	 * Abstract method to retrieve the Firestore collection path.
	 *
	 * Each subclass should provide its specific implementation to return the Firestore collection path.
	 *
	 * @returns A string representing the Firestore collection path.
	 */
	protected abstract getFirestoreCollectionPath(): string;

	/**
	 * Delays the synchronization process by a specified amount of time.
	 *
	 * This method pauses the sync process for the provided number of milliseconds and then proceeds to synchronize the local data with the Firestore.
	 *
	 * @param mills - The number of milliseconds to delay the sync process.
	 * @returns A {@link Promise} that resolves when the sync operation completes.
	 */
	protected async syncDelay(mills: number): Promise<void> {
		await delay(mills);
		return this.sync();
	}

	/**
	 * Synchronizes the local data with the Firestore collection.
	 *
	 * This method retrieves the top local record and queries Firestore for any new documents based on the last updated timestamp (`uat`). If documents are found, they are upserted into the local store.
	 *
	 * Documents marked as deleted (soft deletes) will be removed from the local store.
	 *
	 * @returns A {@link Promise} that resolves when the sync operation completes.
	 */
	protected async sync(): Promise<void> {
		let store = await this.getLocalDatabaseStore();
		let top: T | null = await this.getLocalTop();
		let constraints: QueryConstraint[] = [];

		if (getAuthOrgId()) {
			constraints = [where('oid', '==', getAuthOrgId()), orderBy('uat', 'asc')];
		} else {
			constraints = [orderBy('uat', 'asc')];
		}

		if (top?.uat) {
			constraints.push(where('uat', '>', timestampToDate(top.uat)));
		}

		let [docs] = await this.findFirestoreDocsImpl(...constraints);

		if (docs && docs.length) {
			await store.upsert(docs);

			// Handle soft deletes
			let deleteTasks = docs
				.filter((doc) => doc.isDel)
				.map(async (doc) => {
					let where: WhereConstraint | undefined;
					if (doc?.oid && doc?._id) {
						where = IdbWhere(['oid', '_id'], '==', [doc.oid, doc._id]);
					} else if (doc?._id) {
						where = IdbWhere('_id', '==', doc._id);
					}
					if (where) {
						return store.remove({ where });
					}
				});

			await Promise.all(deleteTasks);
		}
	}

	/**
	 * Retrieves the most recent local document based on the `uat` (updated at) field.
	 *
	 * This method constructs a query to find the top document in the local store that matches the organization ID (`oid`) and falls within a specific time range. If no document is found, it returns `null`.
	 *
	 * @returns A {@link Promise} that resolves to the top document of type `T`, or `null` if no document is found.
	 */
	protected async getLocalTop(): Promise<T | null> {
		let store = await this.getLocalDatabaseStore();
		let where: WhereConstraint[] = [];
		let orgId = getAuthOrgId();
		if (orgId) {
			where = [
				IdbWhere(['oid', '_uatdt'], '>', [orgId, new Date('1900-01-01')]),
				IdbWhere(['oid', '_uatdt'], '<', [orgId, new Date('2200-01-01')])
			];

			let docs: T[] = await store.find<T>({ where, desc: true, limit: 1 })!;
			let top = (docs || [])[0] || null;
			return top;
		}
		return null;
	}

	/**
	 * Retrieves an item from the cache based on the provided ID, optionally forcing a reload.
	 *
	 * This method constructs a cache key using the collection name and, if available, the authenticated organization ID (`authOrgId`).
	 * It then attempts to retrieve the cached item using `AppCacheService`. If the item is not found in the cache or `forceLoad` is set to `true`, it fetches the item from Firestore.
	 *
	 * @private
	 * @param id - The unique identifier of the item to retrieve from the cache.
	 * @param forceLoad - A boolean indicating whether to force a reload from Firestore, bypassing the cache (optional).
	 * @returns A {@link Promise} that resolves to the cached item of type `T` if found, or fetches from Firestore using `getOneFirestore` if not found or `forceLoad` is `true`.
	 *
	 * @throws Will throw an error if the cache retrieval or Firestore fetch fails.
	 */
	private async getChacheItem(id: string, forceLoad?: boolean): Promise<T | null> {
		let type: string = this.collectionName;
		let orgId = getAuthOrgId();
		if (orgId) {
			type = `${type}-${orgId}`;
		}
		return await DatabaseService.getCacheItem<T>(type, id, this.getOneFirestoreDoc.bind(this), forceLoad);
	}

	/**
	 * Retrieves an item from the cache or Firestore by its ID, optionally forcing a reload.
	 *
	 * This method is a public-facing wrapper for `getChacheItem`, allowing external components to retrieve cached items.
	 * If the item is not available in the cache, or `forceLoad` is set to `true`, it will be fetched from Firestore.
	 *
	 * @param id - The unique identifier of the item to retrieve.
	 * @param forceLoad - A boolean indicating whether to force a reload from Firestore, bypassing the cache (optional).
	 * @returns A {@link Promise} that resolves to the item of type `T` if found, either in the cache or Firestore.
	 *
	 * @throws Will throw an error if the cache retrieval or Firestore fetch fails.
	 */
	protected async getOneCache(id: string, forceLoad?: boolean): Promise<T | null> {
		return await this.getChacheItem(id, forceLoad);
	}

	/**
	 * Creates a document in the specified collection and returns the document ID if successful.
	 *
	 * @param data - The data to be stored in the document. Must follow the {@link BaseDataModel} structure.
	 * @param id - Provide optional id
	 * @returns A {@link Promise} that resolves to the document ID as a {@link string}, or {@code null} if the input data is invalid.
	 *
	 * @throws Will throw an error if the Firestore operation (e.g., {@link setDoc}) fails.
	 */
	protected async createFirestoreDoc(data: T, id?: string): Promise<string | null> {
		if (data) {
			id = id || (await this.generateId());
			await this.createFirestoreDocImpl(id, data);
			return id;
		}
		return null;
	}

	/**
	 * Updates a document in the Firestore collection with the specified ID and data.
	 *
	 * @typeParam T - The type extending {@link BaseDataModel} that represents the data structure of the document.
	 *
	 * @param id - The document ID to update.
	 * @param data - The updated document data following the {@link BaseDataModel} structure.
	 *
	 * @returns A {@link Promise} that resolves to the updated document's ID as a string.
	 *
	 * @throws Will throw an error if the Firestore operation fails.
	 */
	protected async updateFirestoreDoc(id: string, data: T): Promise<string> {
		await this.updateFirestoreDocImpl(id, data);
		// Additional logic can be uncommented if needed
		return id;
	}

	/**
	 * Soft deletes a document by marking it as deleted without removing it from the Firestore collection.
	 *
	 * @param id - The document ID to be marked as deleted.
	 *
	 * @returns A {@link Promise} that resolves to the document ID if the operation is successful, or `null` if the operation fails.
	 *
	 * @throws Will throw an error if the Firestore operation fails.
	 */
	protected async deleteFirestoreDocSoft(id: string): Promise<string | null> {
		await this.updateFirestoreDocImpl(id, { isDel: true } as T);
		return id;
	}

	/**
	 * Permanently deletes a document from the Firestore collection.
	 *
	 * @param id - The document ID to be permanently deleted.
	 *
	 * @returns A {@link Promise} that resolves to the document ID if the operation is successful, or `null` if the operation fails.
	 *
	 * @throws Will throw an error if the Firestore operation fails.
	 */
	protected async deleteFirestoreDocHard(id: string): Promise<string | null> {
		await this.deleteFirestoreDocImpl(id);
		return id;
	}

	/**
	 * Retrieves a single document by its ID from the Firestore collection.
	 *
	 * @typeParam T - The type extending {@link BaseDataModel} that represents the data structure of the document.
	 *
	 * @param id - The document ID to retrieve.
	 *
	 * @returns A {@link Promise} that resolves to the document data of type `T` if it exists, or `null` if the document is not found.
	 *
	 * @throws Will throw an error if the Firestore operation fails.
	 */
	protected async getOneFirestoreDoc(id: string): Promise<T | null> {
		let doc = await this.getFirestoreDocImpl(id)!;
		return doc;
	}

	/**
	 * Counts the number of documents in the collection that match the specified query constraints.
	 *
	 * @param queryConstraints - A variable number of {@link QueryConstraint} parameters used to filter the documents in the collection.
	 * @returns A {@link Promise} that resolves to the total number of documents that match the query.
	 *
	 * @throws Will throw an error if the Firestore query fails.
	 */
	protected async countFirestoreDocs(...queryConstraints: QueryConstraint[]): Promise<number> {
		queryConstraints = queryConstraints || [];
		const q = query(
			collection(getFirestore(), this.getFirestoreCollectionPath()),
			...queryConstraints
		);
		const snapshot = await getCountFromServer(q);
		return snapshot.data().count;
	}

	/**
	 * Finds and retrieves documents from the collection based on the provided query constraints.
	 *
	 * @typeParam T - The type extending {@link BaseDataModel} that represents the data structure of the documents.
	 *
	 * @param queryConstraints - A variable number of {@link QueryConstraint} parameters used to filter the documents in the collection.
	 *
	 * @returns A {@link Promise} that resolves to a tuple containing:
	 * - An array of documents of type `T` (with their `_id` field set to the document ID).
	 * - A {@link QuerySnapshot} of {@link DocumentData} containing metadata and information about the query results.
	 *
	 * @throws Will throw an error if the Firestore query fails.
	 */
	protected async findFirestoreDocsImpl(
		...queryConstraints: QueryConstraint[]
	): Promise<[T[], QuerySnapshot<DocumentData>]> {
		let results: T[] = [];
		const q: Query<DocumentData> = query(
			collection(getFirestore(), this.getFirestoreCollectionPath()),
			...queryConstraints
		);
		let snapshot = await getDocs(q);
		if (!snapshot.empty) {
			snapshot.forEach((snap: any) => {
				if (snap.exists()) {
					let data: T = snap.data() as T;
					data._id = snap.id;
					results.push(this.prepareDataForLocalDatabase(data));
				}
			});
		}
		return [results, snapshot];
	}

	/**
	 * Retrieves a document by its ID from the Firestore collection.
	 *
	 * @typeParam T - The type extending {@link BaseDataModel} that represents the data structure of the document.
	 *
	 * @param id - The document ID to retrieve.
	 * @returns A {@link Promise} that resolves to the document data of type `T` if it exists, or `null` if the document is not found.
	 *
	 * @throws Will throw an error if the Firestore operation fails.
	 */
	protected async getFirestoreDocImpl(id: string): Promise<T | null> {
		let path = this.getFirestoreCollectionPath();
		let snapshot = await getDoc(doc(getFirestore(), path, id));
		if (snapshot.exists()) {
			let data: T = snapshot.data() as T;
			data._id = snapshot.id;
			return this.prepareDataForLocalDatabase(data);
		}
		return null;
	}

	/**
	 * Creates a new document in the Firestore collection with the specified ID and data.
	 *
	 * @typeParam T - The type extending {@link BaseDataModel} that represents the data structure of the document.
	 *
	 * @param id - The document ID to create.
	 * @param data - The document data to store, following the {@link BaseDataModel} structure.
	 *
	 * @returns A {@link Promise} that resolves when the document is successfully created.
	 *
	 * @throws Will throw an error if the Firestore operation fails.
	 */
	protected async createFirestoreDocImpl(id: string, data: T): Promise<void> {
		data.oid = getAuthOrgId();
		data.cby = getAuthOrgUserId();
		data.uby = getAuthOrgUserId();
		data.cat = serverTimestamp();
		data.uat = serverTimestamp();
		const path = this.getFirestoreCollectionPath();
		await setDoc(doc(getFirestore(), path, id), data);
	}

	/**
	 * Updates an existing document in the Firestore collection with the specified ID and data.
	 *
	 * @typeParam T - The type extending {@link BaseDataModel} that represents the data structure of the document.
	 *
	 * @param id - The document ID to update.
	 * @param data - The new document data to update, following the {@link BaseDataModel} structure.
	 *
	 * @returns A {@link Promise} that resolves when the document is successfully updated.
	 *
	 * @throws Will throw an error if the Firestore operation fails.
	 */
	protected async updateFirestoreDocImpl(id: string, data: T,): Promise<void> {
		data.uat = serverTimestamp();
		data.oid = getAuthOrgId();
		data.uby = getAuthOrgUserId();
		delete data.cat;
		delete data.cby;
		if (data && data.isDel) {
			data.ttl = getDateDayIncrement(parseInt(APP_TTL_DAYS || '1'));
		}
		await updateDoc(doc(getFirestore(), this.getFirestoreCollectionPath(), id), data);
	}

	/**
	 * Removes a document by its ID from the Firestore collection.
	 *
	 * @param id - The document ID to remove.
	 *
	 * @returns A {@link Promise} that resolves when the document is successfully deleted.
	 *
	 * @throws Will throw an error if the Firestore operation fails.
	 */
	protected async deleteFirestoreDocImpl(id: string): Promise<void> {
		await deleteDoc(doc(getFirestore(), this.getFirestoreCollectionPath(), id));
	}

	/**
	 * Prepares and transforms Firestore document data before displaying it. This method can be used to modify or enhance the document data, such as adding formatted timestamps or combining fields.
	 *
	 * @typeParam T - The type extending {@link BaseDataModel} that represents the data structure of the document.
	 *
	 * @param data - The document data to be prepared for display.
	 * @returns The transformed document data.
	 */
	protected prepareDataForLocalDatabase(data: T): T {
		// Logic to prepare document data for display (e.g., formatting timestamps)
		if (data) {
			if (data.uat || data.cat) {
				data._uatdt = timestampToDate(data.uat || data.cat);
			}
			if (data._id && data.oid) {
				data._onid = `${data.oid}-${data._id}`
			}
		}
		return data;
	}

	/**
	 * Retrieves a document from the local database by its ID.
	 *
	 * This method constructs a query based on the provided document ID (`_id`) and the authenticated organization ID (`oid`) if available.
	 * If the document is not found in the local store, and synchronization is enabled, the method will trigger a sync operation before retrying the retrieval.
	 *
	 * @param id - The unique identifier of the document to retrieve.
	 * @returns A {@link Promise} that resolves to the document of type `T`, or `null` if the document is not found.
	 *
	 * @throws Will throw an error if the local store retrieval fails.
	 */
	protected async getOneLocal(id: string): Promise<T | null> {
		let oid = getAuthOrgId();
		let store = await this.getLocalDatabaseStore();

		let where: WhereConstraint = IdbWhere('_id', '==', id);
		if (oid) {
			where = IdbWhere(['oid', '_id'], '==', [oid, id]);
		}

		if (IS_DEV_ENV) {
			console.log('GET ONE Where', where);
		}

		let doc: T | null = await store.get<T>(where)!;
		if (!doc) {
			if (this.syncEnabled) {
				this.sync();
			}
			doc = await store.get<T>(where);
		}
		return doc;
	}

	/**
	 * Deletes a document from the local database by its file ID (`fid`).
	 *
	 * This method constructs the key for deletion based on the authenticated organization ID (`oid`) and the file ID (`fid`).
	 * If the authenticated organization ID is available, it attempts to remove the document from the local store.
	 *
	 * @param fid - The file ID of the document to delete.
	 * @returns A {@link Promise} that resolves to `true` if the document was successfully deleted, or `false` if the organization ID (`oid`) is not available.
	 *
	 * @throws Will throw an error if the local store removal fails.
	 */
	protected async deleteOneLocal(fid: string): Promise<boolean> {
		let store = await this.getLocalDatabaseStore();
		let oid = getAuthOrgId();
		if (oid) {
			let _onid = `${oid}-${fid}`;
			await store.remove(_onid)!;
			return true;
		}
		return false;
	}

	/**
	 * Find data from local database.
	 * 
	 * @returns {T} array - all recods from local collection 
	 */
	protected async getAllLocal(): Promise<T[]> {
		let store = await this.getLocalDatabaseStore();
		let oid = getAuthOrgId();
		if (oid) {
			let where = IdbWhere(['oid'], "==", [oid])
			let array = await store.find<T>({ where })!;
			return array;
		}
		return [] as T[];
	}


	/**
	 * Clears the in-memory cache for both data and download URLs.
	 * 
	 * This method resets the internal cache (`CACHE`) and download URL cache (`DOWNLOAD_URL_CACHE`) by assigning empty objects to both.
	 * It is typically used when you want to invalidate all cached data and force fresh retrieval on subsequent requests.
	 */
	public static clearCache(): void {
		DatabaseService.CACHE = {};
		// console.log('Cache Cleared!');
	}

	/**
	 * Retrieves an item from the cache or fetches it using a provided function if not found in the cache.
	 * 
	 * This method first checks if the item exists in the cache by constructing a unique cache key using the provided `type` and `id`. 
	 * If the item is not in the cache, it invokes the `getItemFunction` to fetch the item (typically from Firestore or another data source).
	 * The fetched item is then stored in the cache for future access.
	 * 
	 * @typeParam T - The type of the data model, which extends {@link BaseDataModel}.
	 * 
	 * @param type - A string representing the collection or data type, used as part of the cache key.
	 * @param id - The unique identifier of the item to retrieve from the cache.
	 * @param getItemFunction - A function that takes an `id` and returns a {@link Promise} that resolves to the item of type `T` if found, or `null` if not.
	 * 
	 * @returns A {@link Promise} that resolves to the cached item of type `T`, or `null` if the item is not found in either the cache or by `getItemFunction`.
	 * 
	 * @throws Will throw an error if the `getItemFunction` fails to retrieve the item.
	 */
	public static async getCacheItem<T extends BaseDataModel>(
		type: string,
		id: string,
		getItemFunction: (id: string) => Promise<T | null>,
		forceLoad?: boolean,
	): Promise<T | null> {
		let key = `${type}-${id}`;

		// Check if the item is already in the cache
		if (!DatabaseService.CACHE[key] || forceLoad) {
			// Fetch the item using the provided function
			let value: T | null = await getItemFunction(id);

			// Store the fetched item in the cache
			if (value) {
				DatabaseService.CACHE[key] = value;
			}
		}

		// Return the cached item
		return DatabaseService.CACHE[key];
	}








}
