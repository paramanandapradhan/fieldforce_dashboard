import axios from "axios";



const CALL_API_KEY_NAME = 'CALL-API-KEY'


export async function getKV(key: string, token: string) {
    let url = `${process.env.VITE_KV_WORKER_ENDPOINT}/kv/${key}`;
    console.log('Embedding url GET', url)
    let response = await axios.get(url, { headers: { 'Authorization': 'Bearer ' + token } });
    return response?.data?.value;
}

export async function updateKV(key: string, value: any, token: string) {
    let url = `${process.env.VITE_KV_WORKER_ENDPOINT}/kv/${key}`;
    console.log('Embedding url PUT', url)
    let response = await axios.put(url, { value }, { headers: { 'Authorization': `Bearer ${token}` } });
    return response?.data;
}

export async function deleteKV(key: string, token: string) {
    let url = `${process.env.VITE_KV_WORKER_ENDPOINT}/kv/${key}`;
    console.log('Embedding url DELETE', url)
    let response = await axios.delete(url, { headers: { 'Authorization': 'Bearer ' + token } });
    return response?.data;
}


export async function updateApiKeyKV(appId: string, apiKey: string, token: string) {
    let day = new Date().getDate();
    if (token) {
        let key = `PRIMARY-${CALL_API_KEY_NAME}-${appId}`;
        if (day % 2 == 0) {
            key = `SECONDARY-${CALL_API_KEY_NAME}-${appId}`;
        }
        await updateKV(key, apiKey, token);
        console.log('Update api key in KV', key);
    }
}



