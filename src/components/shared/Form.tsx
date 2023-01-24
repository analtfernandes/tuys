import styled from "styled-components";
import { Background } from "./Background";

type FormParams = {
	children: React.ReactNode;
	onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
	config?: Partial<WrapperProps>;
};

type SectionParams = {
	children: React.ReactNode;
	margin?: string;
	textarea?: { min?: string; max?: string };
};

type WrapperProps = {
	width: string;
	padding: string;
	margin: string;
	getBorderColor: (hex: string, alpha: number) => string;
};

type SectionProps = {
	margin: string;
	textarea?: { min?: string; max?: string };
};

export function Form({ children, onSubmit }: FormParams) {
	return (
		<Background config={{ margin: "0 0 20px 0" }}>
			<Wrapper onSubmit={onSubmit}>{children}</Wrapper>
		</Background>
	);
}

Form.Title = ({ children }: React.PropsWithChildren) => {
	return <Title>{children}</Title>;
};

Form.Section = ({ children, margin = "10px 0", textarea }: SectionParams) => {
	return (
		<Section margin={margin} textarea={textarea}>
			{children}
		</Section>
	);
};

const Wrapper = styled.form`
	width: 100%;
	height: 100%;
	padding: 0;
	margin: 0;
`;

const Title = styled.h2`
	font-size: 1.2rem;
	font-weight: 700;
	text-align: center;
	color: ${(props) => props.theme.colors.darkGray};

	@media (max-width: 500px) {
		font-size: 1.1rem;
	}
`;

const Section = styled.div<SectionProps>`
	width: 100%;
	height: auto;
	display: flex;
	flex-direction: column;
	margin: ${(props) => props.margin};

	label {
		font-size: 0.98rem;
		font-weight: 500;
		margin-bottom: 3px;
		color: ${(props) => props.theme.colors.darkGray};
	}

	em {
		color: ${(props) => props.theme.colors.red};
	}

	input {
		width: 100%;
		height: 40px;
		border-radius: 5px;
		background-color: ${(props) => props.theme.colors.white};
		border: 1px solid ${(props) => props.theme.colors.mediumGraySecond};
		padding: 0 11px;
		font-family: "Roboto", sans-serif;
		font-size: 1rem;
		color: ${(props) => props.theme.colors.mediumGraySecond};

		:focus {
			outline: none;
		}

		::placeholder {
			font-family: "Roboto", sans-serif;
			font-size: 1rem;
			color: ${(props) => props.theme.colors.mediumGrayPrimary};
			font-style: italic;
		}

		:-webkit-autofill {
			box-shadow: 0 0 0 30px ${(props) => props.theme.colors.white} inset;
			-webkit-box-shadow: 0 0 0 30px ${(props) => props.theme.colors.white}
				inset;
			-webkit-text-fill-color: ${(props) =>
				props.theme.colors.mediumGraySecond};
		}
	}

	textarea {
		width: 100%;
		height: ${(props) => (props?.textarea?.min ? props.textarea.min : "70px")};
		border-radius: 5px;
		resize: none;
		background-color: ${(props) => props.theme.colors.white};
		border: 1px solid ${(props) => props.theme.colors.mediumGraySecond};
		padding: 10px;
		font-family: "Roboto", sans-serif;
		font-size: 1rem;
		color: ${(props) => props.theme.colors.mediumGraySecond};

		:focus {
			outline: none;
		}

		::placeholder {
			font-family: "Roboto", sans-serif;
			font-size: 1rem;
			color: ${(props) => props.theme.colors.mediumGrayPrimary};
			font-style: italic;
		}

		:-webkit-autofill {
			box-shadow: 0 0 0 30px ${(props) => props.theme.colors.white} inset;
			-webkit-box-shadow: 0 0 0 30px ${(props) => props.theme.colors.white}
				inset;
			-webkit-text-fill-color: ${(props) =>
				props.theme.colors.mediumGraySecond};
		}
	}

	@media (max-width: 500px) {
		label {
			font-size: 0.92rem;
		}

		input {
			font-size: 0.9rem;

			::placeholder {
				font-size: 0.9rem;
			}
		}

		textarea {
			height: ${(props) =>
				props?.textarea?.max ? props.textarea.max : "100px"};
			font-size: 0.9rem;

			::placeholder {
				font-size: 0.9rem;
			}
		}
	}
`;
