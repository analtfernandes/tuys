import styled from "styled-components";
import { useState } from "react";
import { useUserContext } from "../../contexts/UserContext";
import api from "../../services/tuys";
import { useToast, useRequestMutation } from "../../hooks";
import { RequestKeyEnum } from "../utils/enums";
import { Icons } from "../utils";
import { UserRank } from "../shared";

type CreateCommentParams = {
	storyId: number;
};

export function CreateComment({ storyId }: CreateCommentParams) {
	const [newComment, setNewComment] = useState("");
	const { user } = useUserContext();
	const toast = useToast();

	const { isError, isSuccess, ...request } = useRequestMutation(
		[RequestKeyEnum.stories, RequestKeyEnum.comments, storyId],
		(data) => api.postComment(data)
	);

	function handleComment(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const data = { storyId, body: { text: newComment } };

		request.mutate(data);
	}

	if (isError) {
		toast({
			type: "error",
			text:
				request.error ||
				"Não foi possível enviar o comentários. Tente novamente.",
		});
		request.reset();
		return null;
	}

	if (isSuccess) {
		setNewComment("");
		request.reset();
	}

	return (
		<Wrapper>
			<UserRank
				background={user.rankColor}
				image={user.avatar}
				alt={user.username}
				size="small"
			/>

			<form onSubmit={handleComment}>
				<input
					required
					type="text"
					placeholder="Escrever..."
					value={newComment}
					onChange={(e) => setNewComment(e.target.value)}
				/>

				<button>
					<Icons type="send" />
				</button>
			</form>
		</Wrapper>
	);
}

const Wrapper = styled.div`
	width: 100%;
	height: auto;
	margin: 20px 0 0;
	display: flex;

	form {
		width: 100%;
		height: auto;
		position: relative;
		margin-left: 10px;

		input {
			width: 100%;
			height: 34px;
			border: none;
			border-radius: 50px;
			padding: 0 15px;
			outline: none;
			background-color: ${(props) => props.theme.colors.white};
			font-family: "Roboto", sans-serif;
			font-size: 0.9rem;
			color: ${(props) => props.theme.colors.black};

			::placeholder {
				font-style: italic;
			}
		}

		button {
			height: 100%;
			position: absolute;
			right: 7px;
			background-color: transparent;
			border: none;
			outline: none;
			cursor: pointer;

			:hover {
				background-color: transparent;
			}

			svg {
				height: 18px;
				width: auto;
				color: ${(props) => props.theme.colors.darkGray};
			}
		}
	}
`;
