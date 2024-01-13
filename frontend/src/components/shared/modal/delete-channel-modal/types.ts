import { ModalTypesCommonParams } from "../modal-base/types";

type DeleteChannelModalParams = {
	channel: {
		name: string;
		[key: string]: any;
	};
} & ModalTypesCommonParams;

export type { DeleteChannelModalParams };
