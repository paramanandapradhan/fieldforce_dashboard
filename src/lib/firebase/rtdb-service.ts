import { APP_ID } from "$lib/core/services/app-environment-service";
import {
    getDatabase,
    runTransaction,
    child as rtdbChild,
    get as rtdbGet,
    ref as rtdbRef,
    set as rtdbSet
} from "firebase/database";


export async function createRtdbNumberId({ oid, key = 'default' }: { oid?: string, key?: string, } = {}): Promise<string> {
    // console.log('APP_ID', APP_ID);
    let path = `/a/${APP_ID}/ids/global/${key}/_id`;
    if (oid) {
        path = `/a/${APP_ID}/ids/o/${oid}/${key}/_id`;
    }
    let result = await runTransaction(rtdbRef(getDatabase(), path), (value) => {
        value = (value || 0) + 1;
        return value;
    });
    let val: number = result.snapshot.val();

    let id: string = '' + val;

    console.log('new Id', key, id);
    return id;

}

export async function saveRtdbValue(path: string, value: any): Promise<void> {
    const rtdb = getDatabase();
    return rtdbSet(rtdbChild(rtdbRef(rtdb), path), value);
}


export async function loadRtdbValue<T>(path: string): Promise<T | null> {
    const rtdb = getDatabase();
    return rtdbGet(rtdbChild(rtdbRef(rtdb), path))
        .then((snapshot) => {
            if (snapshot.exists()) {
                let value = snapshot.val();
                return value;
            }
        });
}





