import axios from "axios";

export async function updateApiKeyInPlivoApplication(appId: string, apiKey: string, token: string,) {
    // console.log('updatePhoneTokenInPlivoApplication', phone, token)

    if (appId && apiKey && token) {
        let plivoAppUpdateUrl = `${process.env.VITE_PLIVO_WORKER_ENDPOINT}/application/update`;

        let callAnswerUrl = `${process.env.VITE_ANSWER_WORKER_ENDPOINT}/call/answer/${appId}/${apiKey}`;
        let callHandupUrlUrl = `${process.env.VITE_HANGUP_WORKER_ENDPOINT}/call/hangup/${appId}/${apiKey}`;
        let callFallbackUrlUrl = `${process.env.VITE_FALLBACK_WORKER_ENDPOINT}/call/fallback/${appId}/${apiKey}`;

        let payload = {
            app_id: appId,
            answer_url: callAnswerUrl,
            hangup_url: callHandupUrlUrl,
            fallback_answer_url: callFallbackUrlUrl,
        }
        console.log('Ppdated plivo application with api key', plivoAppUpdateUrl, payload)
        await axios.put(plivoAppUpdateUrl, payload, { headers: { 'Authorization': 'Bearer ' + token } });
    }
}