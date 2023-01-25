import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useThemeContext } from "../../../contexts/ThemeContext";
import { CommentType } from "../../utils/Protocols";
import { toast } from "../../utils/Toast";
import { getComments } from "../../../services/tuys";
import { Comment } from "./Comment";

type CommentsProps = {
	storyId: number;
	showComment: boolean;
};

type WrapperProps = {
	height: string;
	padding: string;
};

export function Comments({ storyId, showComment }: CommentsProps) {
	const [comments, setComments] = useState<CommentType[]>([]);
	const defaultHeight = "0px";
	const autoHeight = "auto";
	const [height, setHeight] = useState(defaultHeight);
	const { theme } = useThemeContext();
	const navigate = useNavigate();

	function goToSignIn() {
		toast({
			theme: theme.name,
			type: "warning",
			text: "Sessão encerrada.",
		});
		navigate("/sign-in");
	}

	useEffect(() => {
		if (!showComment && height === autoHeight) {
			setHeight(defaultHeight);
			return;
		}
		if (!showComment) return;

		getComments(storyId)
			.then((comments) => {
				setTimeout(() => setHeight(autoHeight), 100);
				setComments(comments);
			})
			.catch(({ response }) => {
				if (response.status === 401) {
					return goToSignIn();
				}

				toast({
					theme: theme.name,
					type: "error",
					text:
						response?.data?.message ||
						"Não foi possível carregar os comentários. Tente novamente.",
				});
			});
	}, [storyId, showComment]);

	return (
		<Wrapper
			height={height}
			padding={height === defaultHeight ? "0 15px" : "20px 15px"}
		>
			<div>
				{comments.map((comment, index) => (
					<Comment key={index} comment={comment} />
				))}
			</div>
		</Wrapper>
	);
}

const Wrapper = styled.div<WrapperProps>`
	width: 100%;
	height: ${(props) => props.height};
	padding: ${(props) => props.padding};
	max-height: 180px;
	border-radius: 5px;
	background-color: ${(props) => props.theme.colors.lightGray};
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	overflow: scroll;
	position: absolute;
	left: 0;
	z-index: 0;
	transition: all ease 0.1s;
`;
