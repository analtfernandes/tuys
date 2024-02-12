import { ModalConfigOptionsType, ModalType } from "../../components/shared";

type ReducerActionType = {
	type: "state" | "type";
	value: boolean | ModalType;
};

type ModalConfigType = {
	type: ModalType;
} & ModalConfigOptionsType;

type ModalReducerType = React.Reducer<ModalConfigType, ReducerActionType>;

export type { ModalType, ReducerActionType, ModalConfigType, ModalReducerType };
