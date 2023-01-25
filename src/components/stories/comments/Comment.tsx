import styled from "styled-components";
import { UserRank } from "../../shared/UserRank";
import { CommentType } from "../../utils/Protocols";

type CommentProps = {
	comment: CommentType;
};

type StatusProps = {
	colorProps: string;
};

export function Comment({ comment }: CommentProps) {
	return (
		<Wrapper>
			<div>
				<UserRank
					background={comment.owner.rankColor}
					image={comment.owner.avatar}
					alt={comment.owner.username}
					size="small"
				/>

				<div>
					<span>
						{comment.owner.username}
						{comment.owner.isOwner ? <i>{" (você)"}</i> : ""}
					</span>

					<p>{comment.text}</p>
				</div>

				{comment.commentedByAuthor && (
					<Status colorProps="pink">
						<span>autor</span>
					</Status>
				)}

				{comment.isOwnerFollower && !comment.commentedByAuthor && (
					<Status colorProps="pastelBlue">
						<span>seguindo</span>
					</Status>
				)}
			</div>
		</Wrapper>
	);
}

const Wrapper = styled.div`
	width: 100%;
	height: auto;
	display: flex;
	background-color: ${(props) => props.theme.colors.lightGray};
	border-bottom: 1px solid ${(props) => props.theme.colors.text};
	font-size: 0.9rem;

	> div {
		width: 100%;
		height: auto;
		margin: 10px 0;
		display: flex;

		div {
			margin-left: 10px;
		}
	}

	span {
		font-weight: 700;
		line-height: 30px;

		i {
			font-style: italic;
			color: ${(props) => props.theme.colors.mediumGraySecond};
		}
	}

	@media (max-width: 400px) {
		font-size: 0.8rem;
	}
`;

const Status = styled.div<StatusProps>`
	&& {
		margin: 0 0 0 auto;
		align-self: flex-start;

		span {
			font-size: 0.8rem;
			font-weight: 700;
			color: ${(props) => props.theme.colors[props.colorProps]};
		}

		@media (max-width: 400px) {
			span {
				font-size: 0.7rem;
			}
		}
	}
`;
