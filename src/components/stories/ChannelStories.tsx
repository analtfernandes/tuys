import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useInterval } from "use-interval";
import { useThemeContext } from "../../contexts/ThemeContext";
import {
	getStoriesFromChannel,
	getStoriesFromChannelAfterId,
} from "../../services/tuys";
import { toast } from "../utils/Toast";
import { StoryType } from "../utils/Protocols";
import { Button, Title } from "../shared";
import { Story } from "./Story";
import { CreateStory } from "./CreateStory";
import { Icons } from "../utils/Icons";
import { Wrapper } from "./Stories";
import { useNavigateSignIn } from "../hooks";

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
		getStoriesFromChannel(location.channelId)
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
			getStoriesFromChannelAfterId(location.channelId, stories[0].id)
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
						theme={theme}
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
