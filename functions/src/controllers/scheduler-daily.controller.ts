import { onSchedule, ScheduledEvent } from "firebase-functions/scheduler";
import { updateApiKeyKV } from "../services/kv.service";
import { createOrgServiceAccountIdToken } from "../services/auth.service";
import { updateApiKeyInPlivoApplication } from "../services/plivo.service";
import { generateApiKey } from "../utils/utils";

const ROOT_ORG_ID = '1';

// Triggers every night 1:00 AM, cron "0 1 * * *"
// If you want to trigger every minutes, change the cron = "*/1 * * * *"
export const onDailySchedule = onSchedule("0 1 * * *", async (event: ScheduledEvent) => {
    console.log('onDailySchedule start at:', new Date().getHours())
    let serviceToken = await createOrgServiceAccountIdToken(ROOT_ORG_ID); // ROOT ORG ID
    if (serviceToken) {
        let appId = process.env.VITE_PLIVO_APP_ID || '';
        let apiKey = generateApiKey();
        console.log('Updatating daily: ', { apiKey, appId, serviceToken });
        await updateApiKeyKV(appId, apiKey, serviceToken);
        await updateApiKeyInPlivoApplication(appId, apiKey, serviceToken);

    }
    console.log('Daily Scheduled activity done!')
});