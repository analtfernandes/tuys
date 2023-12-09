import styled from "styled-components";
import { SectionProps, DivisionProps } from "./types";

const Wrapper = styled.form`
	width: 100%;
	height: 100%;
	padding: 0;
	margin: 0;

	b {
		font-weight: 700;
	}

	u {
		text-decoration: underline;
	}
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

const Section = styled.section<SectionProps>`
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
		height: ${(props) => props.textarea.min};
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
			height: ${(props) => props.textarea.max};
			font-size: 0.9rem;

			::placeholder {
				font-size: 0.9rem;
			}
		}
	}
`;

const Division = styled.hr<DivisionProps>`
	width: 100%;
	height: 1px;
	background-color: ${(props) => props.theme.colors.darkGray};
	border-color: ${(props) => props.theme.colors.darkGray};
	margin: ${(props) => props.margin};
`;

export { Wrapper, Title, Section, Division };
