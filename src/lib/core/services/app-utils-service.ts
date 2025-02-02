

export const ALLOWED_DOCS_EXT_NAMES: string[] = ['jpg', 'jpeg', 'png', 'webp', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'txt', 'ods', 'odf'];


export function checkActiveUrlPath(urlPaths: string | string[], urlPath: string) {
	if (urlPath && urlPaths) {
		if (Array.isArray(urlPaths)) {
			return urlPaths.includes(urlPath);
		} else {
			return urlPaths == urlPath;
		}
	}
	return false;
}

export function getDateDayIncrement(daysIncrement: number = 1): Date {
	const currentDate = new Date(); // Gets today's date
	currentDate.setDate(currentDate.getDate() + daysIncrement); // Adds daysIncrement days to the current date
	return currentDate;
}



export function getRedirectUrl(): string | null {
	let pathname = window.location.pathname;
	let redirect: string | null = pathname + window.location.search || '';
	// console.log(pathname);
	if (
		['/signin', '/sugnup', '/verify', '/forgot-password'].includes(pathname)
	) {
		redirect = new URLSearchParams(window.location.search).get('redirect');
	}
	return redirect;
}

