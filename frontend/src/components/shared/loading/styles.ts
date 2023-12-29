import styled from "styled-components";
import { WrapperProps } from "./types";

const Wrapper = styled.div<WrapperProps>`
	&& {
		width: fit-content;
		margin: ${(props) => props.margin};
	}
`;

export { Wrapper };
