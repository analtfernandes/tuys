import styled from "styled-components";
import { CallbackType } from "../utils/Protocols";

type BackgroundParams = {
	children: React.ReactNode;
	config?: Partial<WrapperProps>;
};

type WrapperProps = {
	width: string;
	margin: string;
	getBorderColor: CallbackType;
};

type DivisionProps = {
	margin: string;
};

export function Background({ children, config = {} }: BackgroundParams) {
	function hexToRGB(hex: string, alpha = 1) {
		let r = parseInt(hex.slice(1, 3), 16),
			g = parseInt(hex.slice(3, 5), 16),
			b = parseInt(hex.slice(5, 7), 16);

		return `rgba(${r}, ${g}, ${b}, ${alpha})`;
	}

	return (
		<Wrapper
			width={config.width || "100%"}
			margin={config.margin || "0"}
			getBorderColor={hexToRGB}
		>
			{children}
		</Wrapper>
	);
}

Background.Div = ({ margin = "10px 0" }) => {
	return <Division margin={margin}></Division>;
};

const Wrapper = styled.div<WrapperProps>`
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

const Division = styled.div<DivisionProps>`
	width: 100%;
	height: 1px;
	background-color: ${(props) => props.theme.colors.darkGray};
	margin: ${(props) => props.margin};
`;
