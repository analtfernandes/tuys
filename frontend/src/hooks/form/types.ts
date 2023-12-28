import { CallbackType } from "../../components/utils/Protocols";

type FormType = {
	[key: string]: any;
};

type ValidationType = {
	error: boolean;
	message: string;
};

type ValidateFormParam = ValidationType[];

type HandleChangeEventParam = React.ChangeEvent<
	HTMLInputElement | HTMLTextAreaElement
>;

type HandleFormEventParam = React.FormEvent<HTMLFormElement>;

export type {
	CallbackType,
	FormType,
	ValidateFormParam,
	HandleChangeEventParam,
	HandleFormEventParam,
};
