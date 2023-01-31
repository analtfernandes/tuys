import styled from "styled-components";
import { Title } from "../shared";
import { Stories } from "../stories/Stories";

export function Ranking() {
	function getPeriod() {
		const today = new Date();
		const dayIndex = today.getDay();

		const fromDiff = today.getDate() - dayIndex + (dayIndex === 0 ? -6 : 1);
		const from = new Date(today.setDate(fromDiff)).toLocaleDateString("pt-br");

		const toDiff = today.getDate() - dayIndex + 8;
		const to = new Date(today.setDate(toDiff)).toLocaleDateString("pt-br");

		return `${from} - ${to}`;
	}

	return (
		<Wrapper>
			<Title>Ranking</Title>

			<div>
				<span>Top 20 estórias mais curtidas da semana.</span>
			</div>
			<div>
				<span>Período: {getPeriod()}</span>
			</div>

			<Stories path="ranking" />
		</Wrapper>
	);
}

const Wrapper = styled.section`
	width: 100%;
	max-width: 500px;
	height: 100%;
	padding: 0 15px;
	margin: 0 auto;

	> div {
		margin-bottom: 10px;

		> span {
			font-size: 1.2rem;
			color: ${(props) => props.theme.colors.text};
		}
	}

	main {
		padding: 0;
	}

	@media (max-width: 500px) {
		width: 90%;
		padding: 0;

		> div {
			> span {
				font-size: 1rem;
			}
		}
	}

	@media (min-width: 600px) {
		width: 90%;
		padding: 0;
	}

	@media (min-width: 1000px) {
		width: 70%;
		max-width: 700px;
		padding: 0;
	}
`;
