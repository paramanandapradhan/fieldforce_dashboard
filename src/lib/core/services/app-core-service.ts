
export const ROOT_ORG_ID = '1';
export const ADMIN_USER_ID = '1';

let version: string = ''

export function initAppService() {

}

export function hasNotificationPermission() {
    return Notification.permission === 'granted';
}

export async function getAppVersion() {
    if (!version) {
        version = await fetchVersion();
    }
    return version || '';
}

async function fetchVersion() {
    try {
        let res = await fetch('/version.json');
        if (res) {
            return (await res.json())?.version;
        }
    } catch (error) {
    }
}
