import type { BaseDataModel } from '$lib/core/types/app-types';

export type VisitDataModel = BaseDataModel & {
	name?: string;
	desc?: string;
	customer?: string;
	type?: string;
	isPlanned?: boolean;
};
