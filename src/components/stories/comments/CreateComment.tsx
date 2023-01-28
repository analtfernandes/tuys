import styled from "styled-components";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/tuys";
import { SetState, UserType } from "../../utils/Protocols";
import { Icons } from "../../utils";
import { UserRank } from "../../shared";
import { useToast } from "../../hooks";

type CreateCommentParams = {
	storyId: number;
	setUpdateComments: SetState<boolean>;
};

export function CreateComment({
	storyId,
	setUpdateComments,
}: CreateCommentParams) {
	const [newComment, setNewComment] = useState("");
	const [user, setUser] = useState({} as UserType);
	const navigate = useNavigate();
	const toast = useToast();

	useEffect(() => {
		const localData = localStorage.getItem("tuys.com");

		if (localData) {
			setUser(JSON.parse(localData));
		} else {
			toast({
				type: "warning",
				text: "Sessão encerrada.",
			});
			navigate("/sign-in");
		}
	}, [storyId]);

	function handleComment(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const data = { storyId, body: { text: newComment } };
		api
			.postComment(data)
			.then(() => {
				setNewComment("");
				setUpdateComments((prev) => !prev);
			})
			.catch(({ response }) => {
				toast({
					type: "error",
					text:
						response?.data?.message ||
						"Não foi possível enviar o comentários. Tente novamente.",
				});
			});
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
