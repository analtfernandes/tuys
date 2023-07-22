import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { api, StoryType } from "../../services";
import { useToast, useRequestQuery } from "../../hooks";
import { RequestKeyEnum } from "../utils/enums";
import { Icons } from "../utils";
import { Button, Loading, Title } from "../shared";
import { CreateStory } from "./CreateStory";
import { Wrapper } from "./Stories";
import { Story } from "./Story";

export function ChannelStories() {
	const [stories, setStories] = useState<StoryType[]>([]);
	const { state: location } = useLocation();
	const navigate = useNavigate();
	const toast = useToast();

	const {
		isError,
		isSuccess,
		isLoading,
		errorStatus,
		data: haveMoreStories,
		...request
	} = useRequestQuery([RequestKeyEnum.stories, location?.channelId || 1], () =>
		api.getStoriesFromChannel(location?.channelId || 1)
	);

	if (!location) {
		navigate("/channels");
		return null;
	}

	function updateStoriesFunction() {
		if (haveMoreStories) setStories([...haveMoreStories]);
	}

	if (isError && errorStatus !== 404) {
		toast({
			type: "error",
			text:
				request.error ||
				"Não foi possível carregar as histórias. Por favor, recarregue a página.",
		});
	}

	if (errorStatus === 404) {
		toast({
			type: "error",
			text: "Parece que este canal não existe. Por favor, escolha outro.",
		});
	}

	if (
		isSuccess &&
		haveMoreStories &&
		haveMoreStories.length > 0 &&
		stories.length === 0
	) {
		setStories([...haveMoreStories]);
	}

	return (
		<Wrapper>
			<Title>{stories[0]?.channel || location.channelName}</Title>

			<CreateStory channelId={location.channelId} />

			{isLoading && <Loading />}

			{!isLoading && !isError && stories.length === 0 && (
				<div>
					<span>
						Esse canal ainda não possui histórias... Que tal ser o primeiro?
					</span>
				</div>
			)}

			{stories.length > 0 && (
				<>
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
