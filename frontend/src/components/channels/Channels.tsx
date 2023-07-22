import styled from "styled-components";
import { useEffect, useState } from "react";
import { useUserContext } from "../../contexts";
import api from "../../services/tuys";
import { useToast } from "../../hooks";
import { Loading, Subtitle, Title } from "../shared";
import { Channel } from "./Channel";
import { ChannelType } from "../../services";
import { CreateChannel } from "./CreateChannel";

export function Channels() {
	const [channels, setChannels] = useState<ChannelType[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const { user } = useUserContext();
	const toast = useToast();

	useEffect(() => {
		api
			.getChannels()
			.then((response) => {
				if (response) {
					setChannels(response);
					setIsLoading(false);
				}
			})
			.catch(() =>
				toast({
					type: "error",
					text: "Não foi possível carregar os canais. Por favor, recarregue a página.",
				})
			);
	}, []);

	return (
		<Wrapper>
			<Title>Canais</Title>

			<Subtitle>
				Escolha um dos canais para começar a escrever sua estória.
			</Subtitle>

			{isLoading && <Loading />}

			<>
				{channels && channels.length > 0 && (
					<div>
						{channels.map((channel, index) => (
							<Channel
								key={index}
								channel={channel}
								setChannels={setChannels}
							/>
						))}

						{user.isAdmin && <CreateChannel setChannels={setChannels} />}
					</div>
				)}
			</>
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
