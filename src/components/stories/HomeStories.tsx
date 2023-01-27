import { useEffect, useState } from "react";
import api from "../../services/tuys";
import { useThemeContext } from "../../contexts";
import { useNavigateSignIn } from "../hooks";
import { StoryType } from "../utils/Protocols";
import { toast } from "../utils";
import { Story } from "./Story";
import { Wrapper } from "./Stories";

export function HomeStories() {
	const [stories, setStories] = useState<StoryType[]>([]);
	const { theme } = useThemeContext();
	const goSignIn = useNavigateSignIn();

	useEffect(() => {
		api
			.getStories()
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
	}, []);

	return (
		<Wrapper>
			<div>
				{stories.map((story, index) => (
					<Story key={index} story={story} showChannel={true} />
				))}
			</div>
		</Wrapper>
	);
}
