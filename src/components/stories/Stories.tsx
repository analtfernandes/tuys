import styled from "styled-components";
import { useEffect, useState } from "react";
import { useInterval } from "use-interval";
import { useThemeContext } from "../../contexts/ThemeContext";
import {
	getStoriesFromChannel,
	getStoriesFromChannelAfterId,
} from "../../services/tuys";
import { toast } from "../utils/Toast";
import { Button, Title } from "../shared";
import { StoryType } from "../utils/Protocols";
import { useLocation, useNavigate } from "react-router-dom";
import { Story } from "./Story";
import { CreateStory } from "./CreateStory";
import { Icons } from "../utils/Icons";

export function Stories() {
	const [stories, setStories] = useState<StoryType[]>([]);
	const [updateStories, setUpdateStories] = useState(false);
	const [haveMoreStories, setHaveMoreStories] = useState<StoryType[]>([]);
	const { theme } = useThemeContext();
	const { state: location } = useLocation();
	const navigate = useNavigate();

	function goToSignIn() {
		toast({
			theme: theme.name,
			type: "warning",
			text: "Sessão encerrada.",
		});
		navigate("/sign-in");
	}

	function updateStoriesFunction() {
		setStories((prev) => [...haveMoreStories, ...prev]);
		setHaveMoreStories([]);
	}

	useEffect(() => {
		if (location.channelId) {
			getStoriesFromChannel(location.channelId)
				.then((stories) => setStories(stories))
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
		}
	}, [updateStories]);

	useInterval(() => {
		if (stories.length > 0 && location.channelId) {
			getStoriesFromChannelAfterId(location.channelId, stories[0].id)
				.then((newStories) => {
					if (newStories.length > haveMoreStories.length) {
						setHaveMoreStories([...newStories]);
					}
				})
				.catch(({ response }) => {
					if (response.status === 401) {
						return goToSignIn();
					}
				});
		}
	}, 30000);

	return (
		<main>
			<Wrapper>
				{location.channelId && stories[0] && (
					<>
						<Title>{stories[0].channel}</Title>

						<CreateStory
							channelId={location.channelId}
							theme={theme}
							setUpdateStories={setUpdateStories}
							goToSignIn={goToSignIn}
						/>

						{haveMoreStories.length > 0 && (
							<Button
								config={{ type: "secundary" }}
								onClick={updateStoriesFunction}
							>
								<span style={{ marginRight: "10px" }}>
									Há novas estórias para ler
								</span>
								<Icons type="reload" />
							</Button>
						)}

						<div>
							{stories.map((story, index) => (
								<Story key={index} story={story} showChannel={false} />
							))}
						</div>
					</>
				)}
			</Wrapper>
		</main>
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
