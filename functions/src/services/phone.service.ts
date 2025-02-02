import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { PhoneDataModel } from "../types/types";
import { firestore } from "firebase-admin";


export const getPhoneCollectionPath = (oid: string) => {
    return `/a/${process.env.VITE_APP_ID}/o/${oid}/phones`;
}

export const getPhoneDocumentPath = (oid: string, pid: string) => {
    return `/a/${process.env.VITE_APP_ID}/o/${oid}/phones/${pid}`;
}


export async function getAllOrgsPhones(): Promise<PhoneDataModel[]> {
    const phonesQuery = await getFirestore().collectionGroup('phones').where("isDel", "==", false).get();

    const phones: PhoneDataModel[] = phonesQuery.docs.map(doc => ({
        _id: doc.id,
        ...doc.data(),
    }));

    return phones;
}


export async function incrementPhonesTokenVersion(oid: string, pid: string) {
    return firestore().doc(getPhoneDocumentPath(oid, pid)).update({ tokenVersion: FieldValue.increment(1) });
}


export async function bulkIncrementPhonesTokenVersion() {
    try {
        // Query all documents in the collection group
        const querySnapshot = await firestore().collectionGroup('phones')
            .where("isDel", "==", false).get();

        // Process in batches of 500 (Firestore's limit)
        let batch = firestore().batch();
        let counter = 0;

        for (const doc of querySnapshot.docs) {
            const docRef = doc.ref;

            // Increment the field
            batch.update(docRef, {
                tokenVersion: FieldValue.increment(1),
            });

            counter++;

            // Commit the batch if it reaches 500 writes
            if (counter % 500 === 0) {
                await batch.commit();
                batch = firestore().batch(); // Start a new batch
            }
        }

        // Commit the last batch if there are remaining writes
        if (counter % 500 !== 0) {
            await batch.commit();
        }

        console.log(`Successfully incremented tokenVersion documents in phones`);
    } catch (error) {
        console.error("Error performing bulk increment:", error);
    }
}
