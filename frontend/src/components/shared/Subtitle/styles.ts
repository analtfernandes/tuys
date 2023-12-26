import styled from "styled-components";

const Wrapper = styled.span`
	font-size: 1.1rem;
	line-height: 20px;
	font-weight: 400;
	color: ${(props) => props.theme.colors.text};
`;

export { Wrapper };
