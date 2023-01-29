import styled from "styled-components";
import { useEffect, useRef, useState } from "react";
import api from "../../services/tuys";
import { SetState } from "../utils/Protocols";
import { Button } from "../shared";
import { useRequestMutation, useToast } from "../hooks";
import { RequestKeyEnum } from "../utils/enums";

type WrapperProps = {
	height: string;
};

type FormParams = {
	id: number;
	story: {
		title: string;
		body: string;
	};
	editing: boolean;
	setEditing: SetState<boolean>;
};

export function Form({ id, story, editing, setEditing }: FormParams) {
	const { isError, isSuccess, ...request } = useRequestMutation(
		[RequestKeyEnum.stories, id],
		() => api.putStory(editStory, id)
	);

	const [bodyHeight, setBodyHeight] = useState("auto");
	const [editStory, setEditStory] = useState({
		title: "",
		body: "",
	});
	const ref = useRef<HTMLTextAreaElement>(null);
	const toast = useToast();
	const minimusHeight = "80px";
	let disabled = !editing;

	useEffect(() => {
		setEditStory({
			title: story.title,
			body: story.body,
		});
	}, [id, story]);

	useEffect(() => {
		if (ref.current) {
			if (ref.current.scrollHeight > 90) {
				setBodyHeight(minimusHeight);
			} else {
				setBodyHeight(`${ref.current?.scrollHeight}px`);
			}
		}
	}, [ref]);

	function toggleReadMore(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		if (bodyHeight === minimusHeight) {
			setBodyHeight(`${ref.current?.scrollHeight}px`);
			return;
		}

		setBodyHeight(minimusHeight);
	}

	function handleChange(
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) {
		setEditStory((prev) => ({
			...prev,
			[event.target.name]: event.target.value,
		}));
	}

	function handleStory(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		request.mutate(editStory);
	}

	function cancelEdit() {
		setEditStory({
			title: story.title,
			body: story.body,
		});
		setEditing(false);
	}

	function isBodyBiggerThanMinimun() {
		return ref.current?.scrollHeight && ref.current?.scrollHeight >= 90;
	}

	if (isError) {
		toast({
			type: "error",
			text:
				request.error ||
				"Não foi possível atualizar a história. Tente novamente.",
		});
		request.reset();
		return null;
	}

	if (isSuccess) {
		toast({
			type: "success",
			text: "História atualizada com sucesso.",
		});
		story.title = editStory.title;
		story.body = editStory.body;
		setEditing(false);
		request.reset();
	}

	return (
		<Wrapper
			onSubmit={editing ? handleStory : toggleReadMore}
			height={bodyHeight}
		>
			<input
				required
				autoComplete="off"
				disabled={disabled}
				type="text"
				name="title"
				placeholder="Título"
				minLength={3}
				maxLength={30}
				value={editStory.title}
				onChange={handleChange}
			/>
			<textarea
				required
				ref={ref}
				autoComplete="off"
				disabled={disabled}
				name="body"
				placeholder="Corpo"
				minLength={10}
				maxLength={1000}
				value={editStory.body}
				onChange={handleChange}
			/>

			{editing && (
				<Buttons>
					<Button config={{ type: "primary-invert" }} onClick={cancelEdit}>
						Cancelar
					</Button>

					<Button config={{ type: "primary" }}>Atualizar</Button>
				</Buttons>
			)}

			{!editing &&
				isBodyBiggerThanMinimun() &&
				bodyHeight === minimusHeight && <button>...ver mais</button>}

			{!editing &&
				isBodyBiggerThanMinimun() &&
				bodyHeight !== minimusHeight && <button>...ver menos</button>}
		</Wrapper>
	);
}

const Wrapper = styled.form<WrapperProps>`
	width: 100%;
	height: auto;
	display: flex;
	flex-direction: column;
	align-items: center;

	input {
		width: 100%;
		border-radius: 5px;
		padding: 6px;
		outline: none;
		border: 1px solid ${(props) => props.theme.colors.lightGray};
		background-color: transparent;
		font-family: "Roboto", sans-serif;
		font-size: 0.9rem;
		font-weight: 700;
		color: ${(props) => props.theme.colors.black};

		:disabled {
			border: none;
			padding: 0;
		}
	}

	textarea {
		width: 100%;
		height: 90px;
		resize: none;
		overflow: scroll;
		border-radius: 5px;
		padding: 6px;
		outline: none;
		border: 1px solid ${(props) => props.theme.colors.lightGray};
		background-color: transparent;
		font-family: "Roboto", sans-serif;
		font-size: 0.9rem;
		color: ${(props) => props.theme.colors.black};

		:disabled {
			border: none;
			padding: 0;
			height: ${(props) => props.height};
			overflow: hidden;
		}
	}

	> button {
		border: none;
		align-self: flex-end;
		background-color: transparent;
		font-family: "Roboto", sans-serif;
		font-size: 0.8rem;
		font-weight: 700;
		color: ${(props) => props.theme.colors.mediumGraySecond};
		cursor: pointer;
	}

	@media (min-width: 1000px) {
		input {
			font-size: 0.99rem;
		}

		textarea {
			font-size: 0.99rem;
		}
	}
`;

const Buttons = styled.div`
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 10px auto 0;
	width: 50%;
	min-width: 300px;

	@media (max-width: 450px) {
		width: 100%;
		min-width: 100%;
		height: 90px;
		flex-direction: column-reverse;
		justify-content: space-between;
	}
`;
