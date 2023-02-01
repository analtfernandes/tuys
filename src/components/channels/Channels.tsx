import styled from "styled-components";
import api from "../../services/tuys";
import { useToast, useRequestQuery } from "../hooks";
import { Subtitle, Title } from "../shared";
import { RequestKeyEnum } from "../utils/enums";
import { Channel } from "./Channel";

export function Channels() {
	const toast = useToast();
	const {
		isError,
		data: channels,
		...request
	} = useRequestQuery([RequestKeyEnum.channels], () => api.getChannels());

	if (isError) {
		toast({
			type: "error",
			text:
				request.error ||
				"Não foi possível carregar os canais. Por favor, recarregue a página.",
		});
		return null;
	}

	if (typeof channels !== "object") {
		return <></>;
	}

	return (
		<Wrapper>
			{channels.length > 0 && (
				<>
					<Title>Canais</Title>
					<Subtitle>
						Escolha um dos canais para começar a escrever sua estória.
					</Subtitle>

					<div>
						{channels.map((channel, index) => (
							<Channel key={index} {...channel} />
						))}
					</div>
				</>
			)}
		</Wrapper>
	);
}

const Wrapper = styled.section`
	width: 100%;
	height: 100%;
	padding: 0 15px;
	margin: 0 auto;

	> div {
		display: flex;
		align-items: center;
		justify-content: initial;
		margin-top: 30px;
		flex-wrap: wrap;
		margin-bottom: 80px;
	}

	@media (max-width: 450px) {
		> div {
			justify-content: center;
		}
	}

	@media (min-width: 600px) {
		width: 90%;
		padding: 0;
	}

	@media (min-width: 1000px) {
		width: 70%;
		padding: 0;
	}
`;
