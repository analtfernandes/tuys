import { useState } from "react";
import api, { PostStoryParams } from "../../services/tuys";
import { useNavigateSignIn, useToast } from "../hooks";
import { Button, Form } from "../shared";
import { SetState } from "../utils/Protocols";

type CreateStoryParams = {
	channelId: number;
	setUpdateStories: SetState<boolean>;
};

export function CreateStory({
	channelId,
	setUpdateStories,
}: CreateStoryParams) {
	const [story, setStory] = useState({
		channelId,
	} as PostStoryParams);
	const goSignIn = useNavigateSignIn();
	const toast = useToast();

	function handleChange(
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) {
		setStory((prev) => ({ ...prev, [event.target.name]: event.target.value }));
	}

	function isValidFields() {
		if (!story.title || story.title.length < 3) {
			toast({
				type: "warning",
				text: "O título deve ter no mínimo 3 caracteres!",
			});
			return false;
		}

		if (!story.body || story.body.length < 10) {
			toast({
				type: "warning",
				text: "O corpo deve ter no mínimo 10 caracteres!",
			});
			return false;
		}

		if (!story.title || story.title.length > 30) {
			toast({
				type: "warning",
				text: "O título deve ter no máximo 30 caracteres!",
			});
			return false;
		}

		if (!story.body || story.body.length > 1000) {
			toast({
				type: "warning",
				text: "O corpo deve ter no máximo 1000 caracteres!",
			});
			return false;
		}

		return true;
	}

	function handleStory(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		if (isValidFields()) {
			api
				.postStory(story)
				.then(() => {
					setStory({ channelId, title: "", body: "" });
					setUpdateStories((prev) => !prev);
				})
				.catch(({ response }) => {
					if (response.status === 401) {
						return goSignIn();
					}

					toast({
						type: "error",
						text:
							response?.data?.message ||
							"Ocorreu um erro ao enviar história, tente novamente.",
					});
				});
		}
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
					value={story.title}
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
					value={story.body}
					onChange={handleChange}
				/>
			</Form.Section>

			<div style={{ width: "100%", display: "flex", justifyContent: "end" }}>
				<Button config={{ margin: "0" }}>Enviar</Button>
			</div>
		</Form>
	);
}
