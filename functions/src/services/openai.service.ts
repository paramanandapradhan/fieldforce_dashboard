import axios from "axios";

export async function createEmbedding(text: string, token: string) {
    let url = `${process.env.VITE_OPENAI_WORKER_ENDPOINT}/embedding/create`
    console.log('Embedding url', url)
    let response = await axios.post(url, { text }, { headers: { 'Authorization': 'Bearer ' + token } });
    return response?.data?.embedding || [];
}