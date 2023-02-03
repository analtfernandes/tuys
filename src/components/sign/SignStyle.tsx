import styled from "styled-components";
import React from "react";
import banner from "../images/banner.svg";

export function SignStyle({ children }: React.PropsWithChildren) {
	return (
		<Container>
			<img src={banner} alt="TUYS" />
			<div>{children}</div>
		</Container>
	);
}

const Container = styled.main`
	width: 100%;
	height: 100vh;
	margin: 0;
	padding: 0;
	display: flex;

	> img {
		height: 100%;
		width: auto;
		display: initial;
	}

	> div {
		width: 50%;
		max-width: 600px;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin: 0 auto;

		h1 {
			width: 100%;
			margin-bottom: 30px;
			font-size: 1.7rem;
			font-weight: 700;
			color: #a65353;
			text-align: left;
		}

		> form {
			> div {
				position: relative;
				margin-bottom: 30px;

				> svg {
					position: absolute;
					bottom: 5px;
					font-size: 1.4rem;
					color: var(--black);
				}

				input {
					width: 100%;
					height: 30px;
					background-color: var(--white);
					border: none;
					border-bottom: 1px solid var(--medium-gray_two);
					padding: 0 5px 0 35px;
					font-size: 1.1rem;
					color: var(--black);
					outline: none;

					::placeholder {
						color: var(--medium-gray_two);
					}

					:-webkit-autofill {
						box-shadow: 0 0 0 30px var(--white) inset;
						-webkit-box-shadow: 0 0 0 30px var(--white) inset;
					}

					:-webkit-autofill {
						-webkit-text-fill-color: var(--black);
					}

					:focus {
						border-bottom: 2px solid #2b7b8c;
					}
				}
			}
		}

		button {
			width: 190px;
			height: 45px;
			border-radius: 50px;
			background-color: #2b7b8c;
			border: none;
			margin: 10px auto 25px;
			font-size: 1.1rem;
			color: var(--white);
			display: flex;
			align-items: center;
			justify-content: center;
			cursor: pointer;

			:hover {
				filter: brightness(0.9);
			}

			:disabled {
				filter: brightness(0.7);
			}

			> svg {
				font-size: 1.3rem;
			}
		}

		a {
			text-decoration: none;
			text-align: center;
		}

		span {
			line-height: 20px;
			font-size: 1.1rem;
			color: var(--dark-gray);
			margin-bottom: 20px;

			em {
				color: #a65353;
				font-weight: 700;
			}
		}
	}

	@media (max-width: 700px) {
		> img {
			display: none;
		}

		> div {
			width: 90%;

			h1 {
				font-size: 1.4rem;
			}

			form {
				> div {
					input {
						font-size: 1rem;
					}

					svg {
						font-size: 1.3rem;
					}
				}
			}

			button {
				font-size: 1rem;

				svg {
					font-size: 1.1rem;
				}
			}

			span {
				font-size: 1rem;
			}
		}
	}
`;
