import styled from "styled-components";
import { Oval as LoaderSpinner } from "react-loader-spinner";
import { useThemeContext } from "../../contexts";

type LoadingParams = {
	size?: "normal" | "small" | "large";
	margin?: string;
};

type WrapperProps = {
	margin: string;
};

export function Loading({
	size = "normal",
	margin = "20px auto",
}: LoadingParams) {
	const { theme } = useThemeContext();
	let loadingSize = 36;

	if (size === "small") loadingSize = 24;
	if (size === "large") loadingSize = 42;

	return (
		<Wrapper margin={margin}>
			<LoaderSpinner
				height={loadingSize}
				width={loadingSize}
				color={theme.colors.text}
				wrapperStyle={{}}
				wrapperClass=""
				visible={true}
				ariaLabel="oval-loading"
				secondaryColor="none"
				strokeWidth={2}
				strokeWidthSecondary={2}
			/>
		</Wrapper>
	);
}

const Wrapper = styled.div<WrapperProps>`
	&& {
		width: fit-content;
		margin: ${(props) => props.margin};
	}
`;
