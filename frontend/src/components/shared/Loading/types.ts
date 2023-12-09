type LoadingParams = {
	size?: "normal" | "small" | "large";
	color?: string;
} & Partial<WrapperProps>;

type WrapperProps = {
	margin: string;
};

export type { LoadingParams, WrapperProps };
