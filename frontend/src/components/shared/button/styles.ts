import styled, { css } from "styled-components";
import { WrapperStyleProps } from "./types";

const Wrapper = styled.button<WrapperStyleProps>`
	width: ${(props) => props.width};
	height: ${(props) => props.height};
	border-radius: ${(props) => props.radius};
	margin: ${(props) => props.margin};
	padding: ${(props) => props.padding};
	background-color: ${(props) => props.theme.colors.blue};
	color: ${(props) => props.theme.colors.white};
	font-family: "Roboto", sans-serif;
	border: none;
	font-size: 1rem;
	font-weight: 700;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;

	:hover {
		filter: brightness(0.8);
	}

	:disabled {
		filter: brightness(0.6);
		cursor: inherit;
	}

	${(props) =>
		props.buttonType === "secundary" &&
		css`
			background-color: ${props.theme.colors.pink};
		`}

	${(props) =>
		props.buttonType === "primary-invert" &&
		css`
			background-color: ${props.theme.colors.white};
			color: ${props.theme.colors.blue};
			border: 1px solid ${props.theme.colors.blue};
		`}

	@media (max-width: 450px) {
		width: 100%;
	}
`;

export { Wrapper };
