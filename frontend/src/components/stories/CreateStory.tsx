import { useState } from "react";
import api, { PostStoryParams } from "../../services/tuys";
import { useRequestMutation, useToast } from "../../hooks";
import { RequestKeyEnum } from "../utils/enums";
import { Button, Form, Loading } from "../shared";

type CreateStoryParams = {
	channelId: number;
};

export function CreateStory({ channelId }: CreateStoryParams) {
	const [story, setStory] = useState({
		channelId,
	} as PostStoryParams);
	const toast = useToast();

	const { isError, isSuccess, isLoading, ...request } = useRequestMutation(
		[RequestKeyEnum.stories],
		() => api.postStory(story)
	);

	function handleChange(
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) {
		setStory((prev) => ({ ...prev, [event.target.name]: event.target.value }));
	}

	function isValidFields() {
		let message = "";

		if (!story.title || story.title.length < 3) {
			message = "O título deve ter no mínimo 3 caracteres!";
		}

		if (!story.body || story.body.length < 10) {
			message = "O corpo deve ter no mínimo 10 caracteres!";
		}

		if (!story.title || story.title.length > 30) {
			message = "O título deve ter no máximo 30 caracteres!";
		}

		if (!story.body || story.body.length > 1000) {
			message = "O corpo deve ter no máximo 1000 caracteres!";
		}

		if (message.length > 0) {
			toast({
				type: "warning",
				text: message,
			});
			return false;
		}

		return true;
	}

	function handleStory(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		if (!isValidFields()) return;

		request.mutate(story);
	}

	if (isError) {
		toast({
			type: "error",
			text:
				request.error || "Ocorreu um erro ao enviar história, tente novamente.",
		});
		request.reset();
		return null;
	}

	if (isSuccess) {
		setStory({ channelId, title: "", body: "" });
		request.reset();
	}

	return (
		<Form onSubmit={handleStory}>
			<Form.Title>Conte-nos sua estória</Form.Title>

			<Form.Section margin="20px 0">
				<label>
					Título<em>*</em>
				</label>
				<input
					required
					autoComplete="off"
					type="text"
					minLength={3}
					maxLength={30}
					placeholder="O jardim"
					name="title"
					value={story.title || ""}
					onChange={handleChange}
				/>
			</Form.Section>
			<Form.Section>
				<label>
					Corpo<em>*</em>
				</label>
				<textarea
					required
					autoComplete="off"
					minLength={10}
					maxLength={1000}
					placeholder="O jardim estava quieto naquele verão..."
					name="body"
					value={story.body || ""}
					onChange={handleChange}
				/>
			</Form.Section>

			<div style={{ width: "100%", display: "flex", justifyContent: "end" }}>
				<Button config={{ margin: "0" }} disabled={isLoading}>
					{isLoading ? <Loading size="small" /> : "Enviar"}
				</Button>
			</div>
		</Form>
	);
}
