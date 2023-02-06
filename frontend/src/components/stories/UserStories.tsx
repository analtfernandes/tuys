import api from "../../services/tuys";
import { useRequestQuery, useToast } from "../../hooks";
import { Icons } from "../utils";
import { Title, Loading } from "../shared";
import { Story } from "./Story";
import { Wrapper } from "./Stories";
import { RequestKeyEnum } from "../utils/enums";
import { useUserContext } from "../../contexts/UserContext";
import { useParams } from "react-router-dom";

export function UserStories() {
	const { user } = useUserContext();
	const params = useParams();
	const userId = Number(params.userId) || null;
	const toast = useToast();

	const {
		isError,
		isLoading,
		data: stories,
		...request
	} = useRequestQuery(
		[RequestKeyEnum.stories, RequestKeyEnum.user, userId || user.username],
		getUserStories
	);

	if (isError) {
		toast({
			type: "error",
			text:
				request.error ||
				"Não foi possível carregar as histórias. Por favor, recarregue a página.",
		});
	}

	function getUserStories() {
		if (userId && (isNaN(userId) || userId <= 0)) {
			throw new Error(
				JSON.stringify({
					message: "Id de usuário inválido!",
					status: 400,
				})
			);
		}
		if (!userId) {
			return api.getMyStories();
		}
		return api.getUserStories(userId);
	}

	return (
		<Wrapper>
			<Title>
				<Icons type="stories" /> Contos
			</Title>

			<div>
				{isLoading && <Loading />}

				<>
					{stories && stories.length === 0 && (
						<span>Nenhuma história foi criada ainda.</span>
					)}

					{stories &&
						stories.map((story, index) => (
							<Story key={index} story={story} showChannel={true} />
						))}
				</>
			</div>
		</Wrapper>
	);
}
