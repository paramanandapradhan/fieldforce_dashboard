import { onSchedule, ScheduledEvent } from "firebase-functions/scheduler";
import { bulkIncrementPhonesTokenVersion } from "../services/phone.service";


export const onHourlySchedule = onSchedule("*/50 * * * *", async (event: ScheduledEvent) => {


    // update all phone entry with increment of token Version
    await bulkIncrementPhonesTokenVersion();
});