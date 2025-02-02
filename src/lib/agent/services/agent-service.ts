import { getAuthOrgId } from "$lib/auth/services/auth-service.svelte";
import { DatabaseService } from "$lib/database/database-service";
import { APP_ID } from "$lib/core/services/app-environment-service";
import { IdbWhere } from "@cloudparker/easy-idb";
import type { AgentDataModel } from "../types/agent-types";


class AgentDatabaseService extends DatabaseService<AgentDataModel> {

    // Indicates if sync is enabled
    protected syncEnabled: boolean = false;

    // Name of the Firestore collection
    protected collectionName: string = 'agents';

    // Private constructor to prevent direct instantiation
    constructor() {
        super();
    }

    // Constructs the Firestore collection path for agents
    public getFirestoreCollectionPath(): string {
        let path = `/a/${APP_ID}/o/${getAuthOrgId()}/${this.collectionName}`;
        return path;
    }

    public async createAgent(data: AgentDataModel, id?: string) {
        return super.createFirestoreDoc(data, id);
    }

    public async updateAgent(id: string, data: AgentDataModel) {
        return super.updateFirestoreDoc(id, data);
    }

    public async deleteAgent(id: string) {
        return super.deleteFirestoreDocSoft(id);
    }

    public async getAgent(id: string) {
        return super.getOneLocal(id);
    }

    public async getAllAgents() {
        return this.findAgentsLocal()
    }

    public async syncAgents() {
        return super.sync();
    }

    public async getAgentCache(id: string) {
        return super.getOneCache(id)
    }

    protected async findAgentsLocal() {
        let store = await this.getLocalDatabaseStore();
        let oid = getAuthOrgId();
        if (oid) {
            let whereKeys: string[] = ['oid'];
            let whereValue: any[] = [oid];

            let where = IdbWhere(whereKeys, "==", whereValue);
            let array = await store.find<AgentDataModel>({ where })!;
            return array;
        }
        return [] as AgentDataModel[];
    }

}


const agentService = new AgentDatabaseService();

export async function createAgent(data: AgentDataModel, id?: string) {
    return agentService.createAgent(data, id);
}

export async function updateAgent(id: string, data: AgentDataModel) {
    return agentService.updateAgent(id, data);
}

export async function deleteAgent(id: string) {
    return agentService.deleteAgent(id);
}

export async function getAgent(id: string) {
    return agentService.getAgent(id);
}

export async function getAllAgents() {
    return agentService.getAllAgents();
}

export async function syncAgents() {
    return agentService.syncAgents();
}

export async function getAgentCache(id: string) {
    return agentService.getAgentCache(id)
}
