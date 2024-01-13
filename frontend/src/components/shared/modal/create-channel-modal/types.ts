import { ModalTypesCommonParams } from "../modal-base/types";

type CreateChannelModalParams = {
	defaultForm?: {
		[key: string]: any;
	};
} & ModalTypesCommonParams;

export type { CreateChannelModalParams };
