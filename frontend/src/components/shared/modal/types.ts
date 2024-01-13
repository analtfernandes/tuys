import {
	ModalConfigOptionsType,
	ModalTypesCommonParams,
} from "./modal-base/types";

type ModalForm = {
	[key: string]: any;
};

type ModalData = {
	name: string;
};

type ModalType =
	| "denounce_story"
	| "delete_story"
	| "create_channel"
	| "delete_channel";

type ModalParams = {
	type: ModalType;
	defaultForm?: ModalForm;
	data?: ModalData;
} & ModalTypesCommonParams;

export type { ModalParams, ModalType, ModalConfigOptionsType };
