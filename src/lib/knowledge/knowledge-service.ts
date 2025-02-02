import { getAuthOrgId, getToken } from "$lib/auth/services/auth-service.svelte";
import { DatabaseService } from "$lib/database/database-service";
import { APP_ID, OPENAI_WORKER_ENDPOINT } from "$lib/core/services/app-environment-service";
import { IdbWhere } from "@cloudparker/easy-idb";
import type { KnowledgeDataModel, } from "./knowledge-types";
import axios from "axios";


class KnowledgeDatabaseService extends DatabaseService<KnowledgeDataModel> {

    // Indicates if sync is enabled
    protected syncEnabled: boolean = false;

    // Name of the Firestore collection
    protected collectionName: string = 'knowledges';

    constructor() {
        super();
    }

    // Constructs the Firestore collection path for knowledges
    public getFirestoreCollectionPath(): string {
        let path = `/a/${APP_ID}/o/${getAuthOrgId()}/${this.collectionName}`;
        return path;
    }

    public async createKnowledge(data: KnowledgeDataModel, id?: string) {
        return super.createFirestoreDoc(data, id);
    }

    public async updateKnowledge(id: string, data: KnowledgeDataModel) {
        return super.updateFirestoreDoc(id, data);
    }

    public async deleteKnowledge(id: string) {
        return super.deleteFirestoreDocSoft(id);
    }

    public async getKnowledge(id: string) {
        return super.getOneLocal(id);
    }

    public async getAllKnowledges({ topic, agent }: { topic?: string, agent?: string }) {
        return this.findKnowledgesLocal({ topic, agent })
    }

    public async syncKnowledges() {
        return super.sync();
    }

    public async getKnowledgeCache(id: string) {
        return super.getOneCache(id)
    }

    protected async findKnowledgesLocal({ topic, agent }: { topic?: string, agent?: string }) {
        let store = await this.getLocalDatabaseStore();
        let oid = getAuthOrgId();
        if (oid) {
            let whereKeys: string[] = ['oid'];
            let whereValue: any[] = [oid];
            if (topic) {
                whereKeys.push('topic');
                whereValue.push(topic)
            }
            if (agent) {
                whereKeys.push('agent');
                whereValue.push(agent)
            }
            let where = IdbWhere(whereKeys, "==", whereValue);
            let array = await store.find<KnowledgeDataModel>({ where })!;
            return array;
        }
        return [] as KnowledgeDataModel[];
    }

}


const knowledgeService = new KnowledgeDatabaseService();

export async function createKnowledge(data: KnowledgeDataModel, id?: string) {
    if (data.text) {
        data.embedding = await createEmbeddings(data.text)
    }
    return knowledgeService.createKnowledge(data, id);
}

export async function updateKnowledge(id: string, data: KnowledgeDataModel) {
    if (data.text) {
        data.embedding = await createEmbeddings(data.text)
    }
    return knowledgeService.updateKnowledge(id, data);
}

export async function deleteKnowledge(id: string) {
    return knowledgeService.deleteKnowledge(id);
}

export async function getKnowledge(id: string) {
    return knowledgeService.getKnowledge(id);
}

export async function getAllKnowledges({ topic, agent }: { topic?: string, agent?: string } = {}) {
    return knowledgeService.getAllKnowledges({ topic, agent });
}

export async function syncKnowledges() {
    return knowledgeService.syncKnowledges();
}

export async function getKnowledgeCache(id: string) {
    return knowledgeService.getKnowledgeCache(id)
}

export async function createEmbeddings(text: string) {
    let url = `${OPENAI_WORKER_ENDPOINT}/embedding/create`;
    let token = await getToken();
    console.log('Embedding url', url)
    let response = await axios.post(url, { text }, { headers: { 'Authorization': 'Bearer ' + token } });
    return response?.data?.embedding || [];
}
