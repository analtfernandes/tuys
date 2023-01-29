import styled from "styled-components";
import { useEffect, useRef, useState } from "react";
import api from "../../../services/tuys";
import { useToast, useRequestQuery } from "../../hooks";
import { Comment } from "./Comment";
import { CreateComment } from "./CreateComment";
import { RequestKeyEnum } from "../../utils/enums";

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
	const [height, setHeight] = useState(defaultHeight);
	const scrollToLast = useRef<HTMLDivElement>(null);
	const toast = useToast();

	const {
		isError,
		data: comments,
		...request
	} = useRequestQuery(
		[RequestKeyEnum.stories, RequestKeyEnum.comments, storyId],
		() => api.getComments(storyId)
	);

	useEffect(() => {
		scrollToLast.current?.scrollIntoView({
			behavior: "smooth",
			block: "nearest",
		});
	}, [scrollToLast, storyId]);

	if (!showComment && height === autoHeight) {
		setHeight(defaultHeight);
		return null;
	}

	if (!showComment) return null;

	if (isError) {
		toast({
			type: "error",
			text:
				request.error ||
				"Não foi possível carregar os comentários. Tente novamente.",
		});
		return null;
	}

	if (height === defaultHeight) {
		setTimeout(() => setHeight(autoHeight), 100);
	}

	if (typeof comments !== "object") {
		return <></>;
	}

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

			<CreateComment storyId={storyId} />
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
