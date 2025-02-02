import type { BaseDataModel } from '$lib/core/types/app-types';
import type { PaymentStatusEnum } from './payment-service';

export type PaymentDataModel = BaseDataModel & {
	amount?: number;
	date?: any,
	status: PaymentStatusEnum,
};
