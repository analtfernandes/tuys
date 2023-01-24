import styled from "styled-components";

type ButtonParams = {
	children: React.ReactNode;
	disabled?: boolean;
	config?: Partial<WrapperProps> & {
		type?: "primary" | "secundary" | "primary-invert";
	};
	onClick?: () => void;
};

type WrapperProps = {
	width: string;
	height: string;
	margin: string;
	radius: string;
	padding: string;
	buttonType: string;
};

export function Button({
	children,
	disabled = false,
	config = {},
	onClick,
}: ButtonParams) {
	return (
		<Wrapper
			disabled={disabled}
			width={config.width || config.type === "secundary" ? "100%" : "111px"}
			margin={config.margin || "0 auto"}
			height={config.height || "40px"}
			radius={config.radius || ""}
			padding={config.padding || "0"}
			buttonType={config.type || "primary"}
			onClick={onClick}
		>
			{children}
		</Wrapper>
	);
}

const Wrapper = styled.button<WrapperProps>`
	width: ${(props) => props.width};
	height: ${(props) => props.height};
	border-radius: ${(props) => props.radius || "10px"};
	margin: ${(props) => props.margin};
	border: none;
	padding: ${(props) => props.padding};
	background-color: ${(props) => props.theme.colors.blue};
	font-family: "Roboto", sans-serif;
	font-size: 1rem;
	color: ${(props) => props.theme.colors.white};
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
		props.buttonType === "secundary"
			? `
                border-radius: ${props.radius || "50px"};
                background-color: ${props.theme.colors.pink};
            `
			: ""}

	${(props) =>
		props.buttonType === "primary-invert"
			? `
                background-color: ${props.theme.colors.white};
                color: ${props.theme.colors.blue};
                border: 1px solid ${props.theme.colors.blue};
            `
			: ""}

    @media (max-width: 450px) {
		width: 100%;
	}
`;
