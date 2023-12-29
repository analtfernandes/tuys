import { CallbackType } from "../../utils/Protocols";

type FormParams = {
	children: React.ReactNode;
	onSubmit: CallbackType;
	[key: string]: any;
};

type SectionParams = {
	children: React.ReactNode;
	[key: string]: any;
} & Partial<SectionProps>;

type SectionProps = {
	margin: string;
	textarea: { min?: string; max?: string };
};

type DivisionProps = {
	margin: string;
};

export type { FormParams, SectionParams, SectionProps, DivisionProps };
