import styled from "styled-components";
import api from "../../services/tuys";
import { useRequestQuery, useToast } from "../hooks";
import { Story } from "./Story";
import { Wrapper } from "./Stories";
import { RequestKeyEnum } from "../utils/enums";

export function RankingStories() {
	const toast = useToast();

	const {
		isError,
		isSuccess,
		data: stories,
		...request
	} = useRequestQuery([RequestKeyEnum.ranking], () => api.getRanking());

	if (isError) {
		toast({
			type: "error",
			text:
				request.error ||
				"Não foi possível carregar o ranking. Por favor, recarregue a página.",
		});
		return null;
	}

	if (!stories) {
		return null;
	}

	return (
		<StoriesWrapper>
			<div>
				{stories.map((story, index) => (
					<>
						<Division>
							<span>{index + 1}</span>
							<div></div>
						</Division>
						<Story key={index} story={story} showChannel={true} />
					</>
				))}
			</div>
		</StoriesWrapper>
	);
}

const StoriesWrapper = styled(Wrapper)`
	width: 100%;
	padding: 0;
`;

const Division = styled.div`
	&& {
		width: 100%;
		display: flex;
		align-items: center;
		margin-top: 20px;

		> span {
			font-size: 1.2rem;
			color: ${(props) => props.theme.colors.text};
			margin-right: 10px;
		}

		> div {
			width: 100%;
			height: 1px;
			background-color: ${(props) => props.theme.colors.text};
		}

		@media (max-width: 500px) {
			> span {
				font-size: 1rem;
			}
		}
	}
`;
