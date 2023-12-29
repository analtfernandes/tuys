import styled from "styled-components";

const Wrapper = styled.h1`
	font-size: 1.4rem;
	line-height: 60px;
	font-weight: 700;
	color: ${(props) => props.theme.colors.text};

	svg {
		width: auto;
		height: 1.4rem;
		margin-right: 5px;
	}

	@media (max-width: 500px) {
		font-size: 1.2rem;

		svg {
			width: auto;
			height: 1.2rem;
		}
	}
`;

export { Wrapper };
