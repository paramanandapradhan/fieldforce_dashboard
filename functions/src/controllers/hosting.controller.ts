import { onRequest } from 'firebase-functions/v2/https'

let ssrServer: any;
export const ssrServerVendom = onRequest(async (request, response) => {
    if (!ssrServer) {
        console.log("Initialising SvelteKit SSR entry");
        ssrServer = require("../../ssrServerVendom/index").default;
        console.log("SvelteKit SSR entry initialised!");
    }
    console.log("Requested resource: " + request.originalUrl);
    return ssrServer(request, response);
});