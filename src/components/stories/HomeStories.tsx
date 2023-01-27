import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getStories } from "../../services/tuys";
import { useThemeContext } from "../../contexts/ThemeContext";
import { useNavigateSignIn } from "../hooks";
import { toast } from "../utils/Toast";
import { StoryType } from "../utils/Protocols";
import { Story } from "./Story";
import { Wrapper } from "./Stories";

export function HomeStories() {
	const [stories, setStories] = useState<StoryType[]>([]);
	const { theme } = useThemeContext();
	const navigate = useNavigate();
	const goSignIn = useNavigateSignIn();

	useEffect(() => {
		getStories()
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
