import { CallbackType, SetState } from "../../../utils/Protocols";

type ModalBaseParams = {
	title: string;
	trigger: string;
	content: React.ReactElement<any, any>;
	config: ModalConfigType;
	callback: CallbackType;
};

type ModalConfigOptionsType = {
	isOpen: boolean;
	[key: string]: any;
};

type ModalConfigType = {
	modalConfig: ModalConfigOptionsType;
	setModalConfig: SetState<ModalConfigOptionsType>;
};

type ModalTypesCommonParams = {
	config: ModalConfigType;
	callback: CallbackType;
};

export type {
	ModalBaseParams,
	ModalConfigType,
	ModalConfigOptionsType,
	ModalTypesCommonParams,
};
