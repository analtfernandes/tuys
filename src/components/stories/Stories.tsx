import styled from "styled-components";
import { useEffect, useState } from "react";
import { useThemeContext } from "../../contexts/ThemeContext";
import { getStoriesFromChannel } from "../../services/tuys";
import { toast } from "../utils/Toast";
import { Title } from "../shared";
import { StoryType } from "../utils/Protocols";
import { useLocation, useNavigate } from "react-router-dom";
import { Story } from "./Story";
import { CreateStory } from "./CreateStory";

export function Stories() {
	const [stories, setStories] = useState<StoryType[]>([]);
	const [updateStories, setUpdateStories] = useState(false);
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
