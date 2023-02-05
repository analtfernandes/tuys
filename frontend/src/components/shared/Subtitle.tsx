import styled from "styled-components";

export function Subtitle({ children }: React.PropsWithChildren) {
	return <Wrapper>{children}</Wrapper>;
}

const Wrapper = styled.span`
	font-size: 1.1rem;
	line-height: 20px;
	font-weight: 400;
	color: ${(props) => props.theme.colors.text};
`;
