
export const ROOT_ORG_ID = '1';
export const ADMIN_USER_ID = '1';

let version: string = ''

export class AppService {
    private static instance: AppService;

    private constructor() {

    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new AppService()
        }
        return this.instance;
    }

    hasNotificationPermission() {
        return Notification.permission === 'granted';
    }

    async getAppVersion() {
        if (!version) {
            version = await this.fetchVersion();
        }
        return version || '';
    }

    async fetchVersion() {
        try {
            let res = await fetch('/version.json');
            if (res) {
                return (await res.json())?.version;
            }
        } catch (error) {
        }
    }

}


