import styled from "styled-components";
import useInterval from "use-interval";
import { useEffect, useRef, useState } from "react";
import api from "../../../services/tuys";
import { CommentType } from "../../utils/Protocols";
import { useNavigateSignIn, useToast } from "../../hooks";
import { Comment } from "./Comment";
import { CreateComment } from "./CreateComment";

type CommentsProps = {
	storyId: number;
	showComment: boolean;
};

type WrapperProps = {
	height: string;
	padding: string;
	margin: string;
};

export function Comments({ storyId, showComment }: CommentsProps) {
	const defaultHeight = "0px";
	const autoHeight = "auto";
	const [comments, setComments] = useState<CommentType[]>([]);
	const [updateComments, setUpdateComments] = useState(false);
	const [height, setHeight] = useState(defaultHeight);
	const scrollToLast = useRef<HTMLDivElement>(null);
	const goSignIn = useNavigateSignIn();
	const toast = useToast();

	useEffect(() => {
		scrollToLast.current?.scrollIntoView({
			behavior: "smooth",
			block: "nearest",
		});
	}, [scrollToLast.current, storyId]);

	useEffect(() => {
		if (!showComment && height === autoHeight) {
			setHeight(defaultHeight);
			return;
		}
		if (!showComment) return;

		api
			.getComments(storyId)
			.then((comments) => {
				setTimeout(() => setHeight(autoHeight), 100);
				setComments(comments);
			})
			.catch(({ response }) => {
				if (response.status === 401) {
					return goSignIn();
				}

				toast({
					type: "error",
					text:
						response?.data?.message ||
						"Não foi possível carregar os comentários. Tente novamente.",
				});
			});
	}, [storyId, showComment, updateComments]);

	useInterval(() => {
		if (!showComment || comments.length === 0) return;

		api
			.getComments(storyId)
			.then((newComments) =>
				newComments.length > comments.length
					? setComments([...newComments])
					: ""
			)
			.catch(({ response }) => {
				if (response.status === 401) {
					return goSignIn();
				}

				toast({
					type: "error",
					text:
						response?.data?.message ||
						"Não foi possível carregar os comentários. Tente novamente.",
				});
			});
	}, 30000);

	return (
		<Wrapper
			height={height}
			padding={height === defaultHeight ? "0 15px" : "20px 15px"}
			margin={height === defaultHeight ? "0" : "0 0 20px 0"}
		>
			<div>
				{comments.map((comment, index) => (
					<Comment key={index} comment={comment} />
				))}

				{comments.length > 0 && <div ref={scrollToLast} />}
			</div>

			<CreateComment storyId={storyId} setUpdateComments={setUpdateComments} />
		</Wrapper>
	);
}

const Wrapper = styled.div<WrapperProps>`
	width: 100%;
	height: ${(props) => props.height};
	padding: ${(props) => props.padding};
	max-height: 180px;
	border-radius: 5px;
	margin: ${(props) => props.margin};
	background-color: ${(props) => props.theme.colors.lightGray};
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	overflow: scroll;
	position: relative;
	left: 0;
	bottom: 30px;
	z-index: 0;
	transition: all ease 0.1s;
`;
