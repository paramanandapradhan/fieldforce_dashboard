import { getAuthOrgId } from '$lib/auth/services/auth-service.svelte';
import { APP_ID } from '$lib/core/services/app-environment-service';
import { DatabaseService } from '$lib/database/database-service';
import { IdbWhere } from '@cloudparker/easy-idb';
import type { TeamDataModel } from './team-type';

class TeamDatabaseService extends DatabaseService<TeamDataModel> {
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

	public async createTeam(data: TeamDataModel, id?: string) {
		return super.createFirestoreDoc(data, id);
	}

	public async updateTeam(id: string, data: TeamDataModel) {
		return super.updateFirestoreDoc(id, data);
	}

	public async deleteTeam(id: string) {
		return super.deleteFirestoreDocSoft(id);
	}

	public async getTeam(id: string) {
		return super.getOneLocal(id);
	}

	public async getAllTeams() {
		return this.findTeamsLocal();
	}

	public async syncTeams() {
		return super.sync();
	}

	public async getTeamCache(id: string) {
		return super.getOneCache(id);
	}

	protected async findTeamsLocal() {
		let store = await this.getLocalDatabaseStore();
		let oid = getAuthOrgId();
		if (oid) {
			let whereKeys: string[] = ['oid'];
			let whereValue: any[] = [oid];

			let where = IdbWhere(whereKeys, '==', whereValue);
			let array = await store.find<TeamDataModel>({ where })!;
			return array;
		}
		return [] as TeamDataModel[];
	}
}

const routeService = new TeamDatabaseService();

export async function createTeam(data: TeamDataModel, id?: string) {
	return routeService.createTeam(data, id);
}

export async function updateTeam(id: string, data: TeamDataModel) {
	return routeService.updateTeam(id, data);
}

export async function deleteTeam(id: string) {
	return routeService.deleteTeam(id);
}

export async function getTeam(id: string) {
	return routeService.getTeam(id);
}

export async function getAllTeams() {
	return routeService.getAllTeams();
}

export async function syncTeams() {
	return routeService.syncTeams();
}

export async function getTeamCache(id: string) {
	return routeService.getTeamCache(id);
}
