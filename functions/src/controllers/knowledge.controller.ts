

import { onDocumentWritten } from 'firebase-functions/firestore';
import { KnowledgeDataModel } from '../types/types';
import { createOrgServiceAccountIdToken, } from '../services/auth.service';
import { publishKnowledgeEmbedding } from '../services/knowledge.service';

export const onKnowledgeWrite = onDocumentWritten(`/a/${process.env.VITE_APP_ID}/o/{oid}/knowledges/{kid}`,
    async (event) => {
        const oldKnowledge: KnowledgeDataModel = event.data?.before.data() || {};
        let newKnowledge: KnowledgeDataModel = event.data?.after.data() || {};
        oldKnowledge._id = event.params.kid;
        newKnowledge._id = event.params.kid;

        // const pid: string = event.params.pid;
        const oid: string = event.params.oid;

        // console.log('onKnowledgeWrite', oldKnowledge, newKnowledge);
        if (newKnowledge && newKnowledge.text !== oldKnowledge.text) {
            let token = await createOrgServiceAccountIdToken(oid);
            if (token) {
                await publishKnowledgeEmbedding(newKnowledge, token)
            }
            console.log('Knowledge updated success.')
        }
    });