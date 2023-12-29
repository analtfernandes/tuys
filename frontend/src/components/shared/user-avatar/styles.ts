import styled, { css } from "styled-components";
import { WrapperProps } from "./types";

const Wrapper = styled.div<WrapperProps>`
	&& {
		height: ${(props) => `${props.size}px`};
		width: ${(props) => `${props.size}px`};
		border-radius: 50px;
		margin: 0;
		position: relative;
		cursor: ${(props) => props.cursor};

		div {
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0;
			left: 0;
			border-radius: 50px;
			border: 2px solid ${(props) => props.background};
			display: flex;
			align-items: center;
			justify-content: center;
			z-index: 1;
			margin: 0;
			overflow: hidden;

			img {
				width: 90%;
				height: 90%;
				border-radius: 50px;
				object-fit: cover;
			}
		}

		::before {
			content: "";
			display: block;
			width: 100%;
			padding-bottom: 100%;
			border-radius: 50px;
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			z-index: 0;
			animation: spin 5s linear infinite;
			box-shadow: 0 1px 4px 1.1px ${(props) => props.background};
		}

		--reverse::before {
			animation-direction: reverse;
		}

		@keyframes spin {
			from {
				transform: translate(-50%, -50%) rotate(0);
			}
			to {
				transform: translate(-50%, -50%) rotate(360deg);
			}
		}

		${(props) =>
			props.admin &&
			css`
				::before {
					box-shadow: 0 1px 4px 1.1px #ff9a03;
				}
				div {
					border: 3px solid transparent;
					background: linear-gradient(white, white) padding-box,
						${props.background} border-box;
				}
			`}
	}
`;

export { Wrapper };
