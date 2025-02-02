import { getFirestore } from "firebase-admin/firestore";
import { KnowledgeDataModel } from "../types/types";
import { getKV, updateKV } from "./kv.service";
import { getKeyForEmbeddingTexts, getKeyForEmbeddingVectors } from "../utils/utils";


export const getKnowledgeCollectionPath = (oid: string) => {
    return `/a/${process.env.VITE_APP_ID}/o/${oid}/knowledges`;
}

export const getKnowledgeDocumentPath = (oid: string, id: string) => {
    return `/a/${process.env.VITE_APP_ID}/o/${oid}/knowledges/${id}`;
}


export async function publishKnowledgeEmbedding(knowledge: KnowledgeDataModel, token: string) {
    console.log('publishKnowledgeEmbedding');
    if (knowledge?.oid && knowledge._id && knowledge.agent && knowledge.embedding && knowledge.text && token) {

        const kvTexts = (await getKV(getKeyForEmbeddingTexts(knowledge?.oid, knowledge.agent), token)) || {};
        const kvEmbeddings = (await getKV(getKeyForEmbeddingVectors(knowledge?.oid, knowledge.agent), token)) || {};

        kvTexts[knowledge._id] = knowledge.text;
        kvEmbeddings[knowledge._id] = knowledge.embedding;

        const task1 = updateKV(getKeyForEmbeddingTexts(knowledge?.oid, knowledge.agent), kvTexts, token);
        const task2 = updateKV(getKeyForEmbeddingVectors(knowledge?.oid, knowledge.agent), kvEmbeddings, token);

        await Promise.all([task1, task2,]);

        console.log('Embedings published success. knowledge ', knowledge._id);

    }
}

export async function updateKnowledge(id: string, payload: KnowledgeDataModel) {
    if (id && payload.oid) {
        await getFirestore().doc(getKnowledgeDocumentPath(payload.oid, id)).update(payload);
    }
}