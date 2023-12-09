type LoadingParams = {
	size?: "normal" | "small" | "large";
} & Partial<WrapperProps>;

type WrapperProps = {
	margin: string;
};

export type { LoadingParams, WrapperProps };
