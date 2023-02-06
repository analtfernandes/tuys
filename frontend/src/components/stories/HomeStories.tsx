import api from "../../services/tuys";
import { RequestKeyEnum } from "../utils/enums";
import { useRequestQuery, useToast } from "../../hooks";
import { Loading } from "../shared";
import { Story } from "./Story";
import { Wrapper } from "./Stories";

export function HomeStories() {
	const toast = useToast();

	const {
		isError,
		isLoading,
		data: stories,
		...request
	} = useRequestQuery([RequestKeyEnum.stories, RequestKeyEnum.home], () =>
		api.getStories()
	);

	if (isError) {
		toast({
			type: "error",
			text:
				request.error ||
				"Não foi possível carregar as histórias. Por favor, recarregue a página.",
		});
	}

	return (
		<Wrapper>
			<div>
				{isLoading && <Loading />}

				<>
					{stories && stories.length === 0 && (
						<span>
							Você ainda não escreveu nenhuma história! <br /> Ei, já segue
							alguém para ver as histórias deles aqui também?
						</span>
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
