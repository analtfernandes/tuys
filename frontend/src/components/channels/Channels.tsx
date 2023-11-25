import { useUserContext } from "../../contexts";
import { useListChannels } from "../../hooks";
import { Loading, Subtitle, Title } from "../shared";
import { Channel } from "../channel/Channel";
import { CreateChannel } from "../create-channel/CreateChannel";
import { Wrapper } from "./styles";

export function Channels() {
	const { channels, isLoading } = useListChannels();
	const { user } = useUserContext();

	return (
		<Wrapper>
			<Title>Canais</Title>

			<Subtitle>
				Escolha um dos canais para começar a escrever sua estória.
			</Subtitle>

			{isLoading && <Loading />}

			<>
				{channels && channels.length > 0 && (
					<section>
						{channels.map((channel) => (
							<Channel key={channel.id} channel={channel} />
						))}

						{user.isAdmin && <CreateChannel />}
					</section>
				)}
			</>
		</Wrapper>
	);
}
