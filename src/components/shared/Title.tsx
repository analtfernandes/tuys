import styled from "styled-components";

export function Title({ children }: React.PropsWithChildren) {
	return <Wrapper>{children}</Wrapper>;
}

const Wrapper = styled.h1`
	font-size: 1.4rem;
	line-height: 60px;
	font-weight: 700;
	color: ${(props) => props.theme.colors.text};
`;
