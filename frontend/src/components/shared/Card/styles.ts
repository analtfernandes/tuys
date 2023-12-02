import styled from "styled-components";
import { WrapperStyleProps, DivisionStyleProps } from "./types";

const Wrapper = styled.div<WrapperStyleProps>`
	&& {
		width: ${(props) => props.width};
		height: auto;
		padding: 20px;
		border-radius: 5px;
		position: relative;
		z-index: 1;
		margin: ${(props) => props.margin};
		background-color: ${(props) => props.theme.colors.white};
		box-shadow: 0 0 4px 1px
			${(props) => props.getBorderColor(props.theme.colors.darkGray, 0.25)};
		transition: all ease 0.1s;

		@media (max-width: 400px) {
			padding: 15px;
		}
	}
`;

const Division = styled.div<DivisionStyleProps>`
	width: 100%;
	height: 1px;
	background-color: ${(props) => props.theme.colors.darkGray};
	margin: ${(props) => props.margin};
`;

export { Wrapper, Division };
