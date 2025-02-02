import { onDocumentDeleted } from 'firebase-functions/v2/firestore';
import { updateFile } from '../services/file.service';
import type { DocumentDataModel, } from '../types/types';
import { getDateIncrement } from '../utils/utils';

export const onDocumentDelete = onDocumentDeleted(`/a/${process.env.VITE_APP_ID}/o/{oid}/docs/{did}`,
    async (event) => {
        let oldDocument: DocumentDataModel = event.data?.data() || {};


        // const eid: string = event.params.eid;
        const oid: string = event.params.oid;

        let tasks: any[] = [];
        if (oldDocument?.file) {
            let action = updateFile({ oid, fid: oldDocument?.file, payload: { isDel: true, ttl: getDateIncrement(parseInt(process.env.VITE_TTL_DAYS || '1')) } });
            tasks.push(action);
        }

        await Promise.all(tasks);

        console.log('Document file marked as deleted');
    }
);