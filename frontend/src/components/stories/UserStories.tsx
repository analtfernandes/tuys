import api from "../../services/tuys";
import { useRequestQuery, useToast } from "../../hooks";
import { Icons } from "../utils";
import { Title, Loading } from "../shared";
import { Story } from "./Story";
import { RequestKeyEnum } from "../utils/enums";
import { useUserContext } from "../../contexts/UserContext";
import { useParams } from "react-router-dom";
import styled from "styled-components";

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
		[RequestKeyEnum.stories, RequestKeyEnum.user, userId || user.id],
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
			throw new Error("Um erro ocorreu!", {
				cause: {
					message: "Id de usuário inválido!",
					status: 400,
				},
			});
		}
		if (!userId) {
			return api.getMyStories();
		}
		return api.getUserStories(userId);
	}

	return (
		<StoriesSection>
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
		</StoriesSection>
	);
}

const StoriesSection = styled.section`
	&& {
		width: 100%;
		min-width: 400px;
		height: 100%;
		margin: 0 auto;

		> div {
			display: flex;
			align-items: center;
			justify-content: initial;
			flex-wrap: wrap;
			margin-bottom: 80px;

			> span {
				line-height: 20px;
				margin-top: 30px;
				font-size: 1.1rem;
				color: ${(props) => props.theme.colors.text};
			}
		}

		@media (max-width: 345px) {
			> div {
				justify-content: center;
			}
		}

		@media (max-width: 900px) {
			width: 90%;
			margin: 0;
		}

		@media (max-width: 860px) {
			width: 80%;
			margin: 0;
		}

		@media (max-width: 800px) {
			width: 100%;
			min-width: 100%;
			margin: 0 auto;
		}
	}
`;
