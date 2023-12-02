import { CallbackType } from "../../utils/Protocols";

type CardParams = {
	children: React.ReactNode;
	[key: string]: any;
};

type CardDivParams = {
	[key: string]: any;
};

type WrapperStyleProps = {
	width: string;
	margin: string;
	getBorderColor: CallbackType;
};

type DivisionStyleProps = {
	margin: string;
};

export type {
	CardParams,
	CardDivParams,
	WrapperStyleProps,
	DivisionStyleProps,
};
