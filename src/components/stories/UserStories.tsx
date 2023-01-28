import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/tuys";
import { useNavigateSignIn, useToast } from "../hooks";
import { StoryType } from "../utils/Protocols";
import { Icons } from "../utils";
import { Title } from "../shared";
import { Story } from "./Story";
import { Wrapper } from "./Stories";

export function UserStories() {
	const [stories, setStories] = useState<StoryType[]>([]);
	const { state: location } = useLocation();
	const goSignIn = useNavigateSignIn();
	const toast = useToast();

	useEffect(() => {
		if (!location?.userId) {
			api
				.getMyStories()
				.then((stories) => setStories(stories))
				.catch(({ response }) => {
					if (response.status === 401) {
						return goSignIn();
					}

					toast({
						type: "error",
						text: response?.data?.message,
					});
				});
			return;
		}
	}, [location?.userId]);

	return (
		<Wrapper>
			<Title>
				<Icons type="stories" /> Contos
			</Title>

			<div>
				{stories.map((story, index) => (
					<Story key={index} story={story} showChannel={true} />
				))}
			</div>
		</Wrapper>
	);
}
