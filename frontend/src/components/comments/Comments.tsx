import styled from "styled-components";
import { useEffect, useRef } from "react";
import api from "../../services/tuys";
import { RequestKeyEnum } from "../utils/enums";
import { useToast, useRequestQuery } from "../../hooks";
import { Loading } from "../shared";
import { Comment } from "./Comment";
import { CreateComment } from "./CreateComment";

type CommentsProps = {
	storyId: number;
	storyIsBanned: boolean;
};

export function Comments({ storyId, storyIsBanned }: CommentsProps) {
	const scrollToLast = useRef<HTMLDivElement>(null);
	const toast = useToast();

	const {
		isError,
		isLoading,
		data: comments,
		...request
	} = useRequestQuery(
		[RequestKeyEnum.stories, RequestKeyEnum.comments, storyId],
		() => api.getComments(storyId)
	);

	useEffect(() => {
		scrollToLast.current?.scrollIntoView({
			behavior: "auto",
			block: "center",
		});
	}, []);

	if (isError) {
		toast({
			type: "error",
			text:
				request.error ||
				"Não foi possível carregar os comentários. Tente novamente.",
		});
	}

	return (
		<Wrapper>
			<>
				{isLoading && <Loading />}

				{comments && (
					<div>
						{comments.map((comment, index) => (
							<Comment key={index} comment={comment} />
						))}

						{comments.length > 0 && <div ref={scrollToLast} />}
					</div>
				)}
			</>

			<CreateComment storyId={storyId} storyIsBanned={storyIsBanned} />
		</Wrapper>
	);
}

const Wrapper = styled.div`
	width: 100%;
	height: auto;
	padding: 20px 15px;
	max-height: 180px;
	border-radius: 5px;
	margin: 0 0 20px 0;
	background-color: ${(props) => props.theme.colors.lightGray};
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	overflow: scroll;
	position: relative;
	left: 0;
	bottom: 30px;
	z-index: 0;
`;
