import type { BaseDataModel } from '$lib/core/types/app-types';

export type RouteDataModel = BaseDataModel & {
	name?: string,
	desc?: string,
	customers?: string[],
	plans?: { [userId: string]: number[] },
	manager?: string,
};
