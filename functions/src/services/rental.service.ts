// import * as admin from "firebase-admin";
// import { SERVICE_USER_ID } from "./common.service";
// import { RentalDataModel } from "../types/types";
// import { getFirestore } from "firebase-admin/firestore";


// export const getRentalCollectionPath = (oid: string) => {
//     return `/a/${process.env.VITE_APP_ID}/o/${oid}/rentals`;
// }

// export const getRentalDocumentPath = (oid: string, id: string) => {
//     return `/a/${process.env.VITE_APP_ID}/o/${oid}/rentals/${id}`;
// }


// export async function createRental({ oid, amount, source, }: { oid: string, amount: number, source: string, }) {
//     if (amount) {
//         let payload: RentalDataModel = {};
//         payload.cat = admin.firestore.FieldValue.serverTimestamp();
//         payload.uat = admin.firestore.FieldValue.serverTimestamp();
//         payload.cby = SERVICE_USER_ID;
//         payload.uby = SERVICE_USER_ID;
//         payload.amount = amount;
//         payload.oid = oid;
//         payload.source = source;

//         if (payload.oid) {
//             const doc = await getFirestore().collection(getRentalCollectionPath(payload.oid))
//                 .add(payload);
//             console.log('createRental success', 'id: ', doc.id);
//             return doc;
//         }
//     }
// }