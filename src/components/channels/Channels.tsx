import styled from "styled-components";
import { useEffect, useState } from "react";
import { useThemeContext } from "../../contexts/ThemeContext";
import { getChannels } from "../../services/tuys";
import { toast } from "../utils/Toast";
import { Subtitle, Title } from "../shared";
import { Channel } from "./Channel";
import { ChannelType } from "../utils/Protocols";
import { useNavigate } from "react-router-dom";

export function Channels() {
	const [channels, setChannels] = useState<ChannelType[]>([]);
	const { theme } = useThemeContext();
	const navigate = useNavigate();

	function goToSignIn() {
		toast({
			theme: theme.name,
			type: "warning",
			text: "Sessão encerrada.",
		});
		navigate("/sign-in");
	}

	useEffect(() => {
		getChannels()
			.then((channels) => setChannels(channels))
			.catch(({ response }) => {
				if (response.status === 401) {
					return goToSignIn();
				}

				toast({
					theme: theme.name,
					type: "error",
					text: response?.data?.message,
				});
			});
	}, []);

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

	@media (max-width: 345px) {
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
