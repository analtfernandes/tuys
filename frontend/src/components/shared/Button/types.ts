type ButtonType = "primary" | "secundary" | "primary-invert";

type ButtonParams = {
	children: React.ReactNode;
	type?: ButtonType;
	isLoading?: boolean;
	[key: string]: any;
} & Partial<Omit<WrapperStyleProps, "buttonType">>;

type WrapperStyleProps = {
	width: string;
	height: string;
	margin: string;
	radius: string;
	padding: string;
	buttonType: ButtonType;
};

export type { ButtonParams, WrapperStyleProps };
