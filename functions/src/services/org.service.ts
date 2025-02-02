import * as admin from "firebase-admin"

export const createFirebaseOrg = async ({ oid, org }: { oid: string, org: any }) => {
    return await admin.database().ref(`/a/${process.env.VITE_APP_ID}/o/${oid}`).set({ name: org.name, votingNo: 0 })
}

export const removeFirebaseOrg = async ({ oid }: { oid: string }) => {
    return await admin.database().ref(`/a/${process.env.VITE_APP_ID}/o/${oid}`).remove();
}