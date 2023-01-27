import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useInterval } from "use-interval";
import api from "../../services/tuys";
import { useThemeContext } from "../../contexts";
import { useNavigateSignIn } from "../hooks";
import { StoryType } from "../utils/Protocols";
import { toast, Icons } from "../utils";
import { Button, Title } from "../shared";
import { CreateStory } from "./CreateStory";
import { Wrapper } from "./Stories";
import { Story } from "./Story";

export function ChannelStories() {
	const [stories, setStories] = useState<StoryType[]>([]);
	const [updateStories, setUpdateStories] = useState(false);
	const [haveMoreStories, setHaveMoreStories] = useState<StoryType[]>([]);
	const { state: location } = useLocation();
	const goSignIn = useNavigateSignIn();
	const { theme } = useThemeContext();

	function updateStoriesFunction() {
		setStories((prev) => [...haveMoreStories, ...prev]);
		setHaveMoreStories([]);
	}

	useEffect(() => {
		api
			.getStoriesFromChannel(location.channelId)
			.then((stories) => setStories(stories))
			.catch(({ response }) => {
				if (response.status === 401) {
					return goSignIn();
				}

				toast({
					theme: theme.name,
					type: "error",
					text: response?.data?.message,
				});
			});
	}, [updateStories, location.channelId]);

	useInterval(() => {
		if (stories.length > 0) {
			api
				.getStoriesFromChannelAfterId(location.channelId, stories[0].id)
				.then((newStories) => {
					if (newStories.length > haveMoreStories.length) {
						setHaveMoreStories([...newStories]);
					}
				})
				.catch(({ response }) => {
					if (response.status === 401) {
						return goSignIn();
					}
				});
		}
	}, 30000);

	return (
		<Wrapper>
			{stories[0] && (
				<>
					<Title>{stories[0].channel}</Title>

					<CreateStory
						channelId={location.channelId}
						setUpdateStories={setUpdateStories}
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
	);
}
