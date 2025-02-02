import * as admin from "firebase-admin";

export async function updateBalance({ oid, amount }: { oid: string, amount: number }) {
    if (oid && amount) {
        let path = `/a/${process.env.VITE_APP_ID}/o/${oid}/balance`;
        let result = await admin.database().ref(path).transaction((value) => {
            value = (value || 0) + amount;
            return value;
        });
        let val: number = result.snapshot.val();
        return val;
    }
    return 0;
}