import styled from "styled-components";
import { Subtitle, Title } from "../shared";

export function Settings() {
	return (
		<Wrapper>
			<Title>Configurações</Title>
			<Subtitle>
				Edite suas informações ou configure suas prefências no menu lateral.
			</Subtitle>
		</Wrapper>
	);
}

const Wrapper = styled.section`
	display: initial;

	> span {
		color: ${(props) => props.theme.colors.mediumGraySecond};
	}

	@media (max-width: 500px) {
		display: none;
	}
`;
