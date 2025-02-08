import type { BaseDataModel } from '$lib/core/types/app-types';

export type RouteDataModel = BaseDataModel & {
	name?: string,
	desc?: string,
	customers?: string[],
	plans?: RoutePlans,
	manager?: string,
};

export type RoutePlans = {
	user?: string,
	weekday?: number;
}
