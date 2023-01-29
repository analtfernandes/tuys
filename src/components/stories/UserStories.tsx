import api from "../../services/tuys";
import { useRequestQuery, useToast } from "../hooks";
import { Icons } from "../utils";
import { Title } from "../shared";
import { Story } from "./Story";
import { Wrapper } from "./Stories";
import { RequestKeyEnum } from "../utils/enums";
import { useUserContext } from "../../contexts/UserContext";

export function UserStories() {
	const { user } = useUserContext();
	const toast = useToast();

	const {
		isError,
		isSuccess,
		data: stories,
		...request
	} = useRequestQuery(
		[RequestKeyEnum.stories, RequestKeyEnum.user, user.username],
		() => api.getMyStories()
	);

	if (isError) {
		toast({
			type: "error",
			text:
				request.error ||
				"Não foi possível carregar as histórias. Por favor, recarregue a página.",
		});
		return null;
	}

	if (!stories) {
		return null;
	}

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
