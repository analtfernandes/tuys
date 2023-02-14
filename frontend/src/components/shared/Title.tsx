import styled from "styled-components";

type TitleParams = {
	children: React.ReactNode;
	textPadding?: string;
	iconPadding?: string;
};

type WrapperProps = {
	textPadding: string;
	iconPadding: string;
};

export function Title({
	children,
	textPadding = "0",
	iconPadding = "0",
}: TitleParams) {
	return (
		<Wrapper textPadding={textPadding} iconPadding={iconPadding}>
			{children}
		</Wrapper>
	);
}

const Wrapper = styled.h1<WrapperProps>`
	font-size: 1.4rem;
	line-height: 60px;
	font-weight: 700;
	color: ${(props) => props.theme.colors.text};
	margin: ${(props) => props.textPadding};

	svg {
		width: auto;
		height: 1.4rem;
		margin: ${(props) => props.iconPadding};
		margin-right: 5px;
	}

	@media (max-width: 500px) {
		font-size: 1.2rem;

		svg {
			width: auto;
			height: 1.2rem;
		}
	}
`;
