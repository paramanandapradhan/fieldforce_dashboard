import * as admin from "firebase-admin"

export async function createRtdbNumberId({ org, key = 'default', startValue = 0 }: { org?: string, key?: string, startValue?: number } = {}) {
    console.log('process.env.VITE_APP_ID', process.env.VITE_APP_ID);
    let path = `/a/${process.env.VITE_APP_ID}/ids/global/${key}/_id`;
    if (org) {
        path = `/a/${process.env.VITE_APP_ID}/ids/o/${org}/${key}/_id`;
    }
    let result = await admin.database().ref(path).transaction((value) => {
        value = (value || startValue) + 1;
        return value;
    });
    let val: number = result.snapshot.val();
    let strId = val.toString();

    console.log(key, 'createRtdbNumberId = ', strId);
    return strId;

}

export async function updateFieldCounter({ oid, coll, field, update = 0 }: { oid: string, coll: string, field: string, update: number }) {
    let path = `/a/${process.env.VITE_APP_ID}/o/${oid}/${coll}/${field}`;
    let result = await admin.database().ref(path).transaction((value) => {
        value = (value || 0) + update;
        return value;
    });
    let val: number = result.snapshot.val();
    return val;
}


