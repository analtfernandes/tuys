import { useLocation } from "react-router-dom";
import { useState } from "react";
import api from "../../services/tuys";
import { useToast, useRequestQuery } from "../../hooks";
import { StoryType } from "../utils/Protocols";
import { RequestKeyEnum } from "../utils/enums";
import { Icons } from "../utils";
import { Button, Title } from "../shared";
import { CreateStory } from "./CreateStory";
import { Wrapper } from "./Stories";
import { Story } from "./Story";

export function ChannelStories() {
	const [stories, setStories] = useState<StoryType[]>([]);
	const { state: location } = useLocation();
	const toast = useToast();

	const {
		isError,
		isSuccess,
		data: haveMoreStories,
		...request
	} = useRequestQuery([RequestKeyEnum.stories, location.channelId], () =>
		api.getStoriesFromChannel(location.channelId)
	);

	function updateStoriesFunction() {
		if (haveMoreStories) setStories([...haveMoreStories]);
	}

	if (isError) {
		toast({
			type: "error",
			text:
				request.error ||
				"Não foi possível carregar as histórias. Por favor, recarregue a página.",
		});
		return null;
	}

	if (isSuccess && haveMoreStories && stories.length === 0) {
		setStories([...haveMoreStories]);
	}

	return (
		<Wrapper>
			{stories.length > 0 && (
				<>
					<Title>{stories[0].channel}</Title>

					<CreateStory channelId={location.channelId} />

					{haveMoreStories && haveMoreStories.length > stories.length && (
						<>
							<Button
								config={{ type: "secundary" }}
								onClick={updateStoriesFunction}
							>
								<span style={{ marginRight: "10px" }}>
									Há novas estórias para ler
								</span>
								<Icons type="reload" />
							</Button>

							<div>
								{stories?.map((story, index) => (
									<Story key={index} story={story} showChannel={false} />
								))}
							</div>
						</>
					)}

					{haveMoreStories && haveMoreStories.length <= stories.length && (
						<div>
							{haveMoreStories?.map((story, index) => (
								<Story key={index} story={story} showChannel={false} />
							))}
						</div>
					)}
				</>
			)}
		</Wrapper>
	);
}
