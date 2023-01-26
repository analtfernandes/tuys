import styled from "styled-components";
import { Background } from "../shared";
import { StoryType } from "../utils/Protocols";
import { UserRank } from "../shared/UserRank";
import { Icons } from "../utils/Icons";
import { Form } from "./Form";
import { useState } from "react";
import { postDenounce, postLike, postUnlike } from "../../services/tuys";
import { Comments } from "./comments/Comments";
import Modal from "../shared/Modal";
import { toast } from "../utils/Toast";
import { useThemeContext } from "../../contexts/ThemeContext";

type StoryParams = {
	story: StoryType;
	showChannel: boolean;
};

type OptionProps = {
	iconColor: string;
};

export function Story({ story, showChannel = true }: StoryParams) {
	const [like, setLike] = useState(story.likedByUser);
	const [showComment, setShowComment] = useState(false);
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const { theme } = useThemeContext();
	const { owner } = story;

	function compactNumber(number: number) {
		return Intl.NumberFormat("pt-br", {
			notation: "compact",
		}).format(number);
	}

	function toggleLike() {
		if (!like) {
			setLike(true);
			postLike(story.id)
				.then()
				.catch(() => setLike(false));
			return;
		}

		setLike(false);
		postUnlike(story.id)
			.then()
			.catch(() => setLike(true));
	}

	function denounceStory({ text }: { text: string }) {
		if (text.length < 3) {
			toast({
				theme: theme.name,
				type: "error",
				text: "A mensagem deve ter pelo menos 3 caracteres!",
			});
			return;
		}

		const param = { storyId: story.id, body: { text } };

		postDenounce(param)
			.then(() =>
				toast({
					theme: theme.name,
					type: "success",
					text: "Denuncia enviada com sucesso. Agradecemos pela contribuição.",
				})
			)
			.catch(({ response }) => {
				toast({
					theme: theme.name,
					type: "error",
					text:
						response?.data?.message ||
						"Não foi enviar a denúncia. Tente novamente.",
				});
			});
	}

	return (
		<>
			{modalIsOpen && (
				<Modal
					type="denounceStory"
					modalIsOpen={modalIsOpen}
					setModalIsOpen={setModalIsOpen}
					callback={denounceStory}
				/>
			)}

			<Background config={{ margin: "20px 0" }}>
				<Author>
					<UserRank
						background={owner.rankColor}
						image={owner.avatar}
						alt={owner.username}
					/>

					<div>
						<span>{owner.username}</span>
						{showChannel && <Channel>#{story.channel.toUpperCase()}</Channel>}
					</div>

					{!owner.isOwner && story.followedByUser && (
						<Following>
							<span>Seguindo</span>
						</Following>
					)}

					{owner.isOwner && (
						<OwnerOptions>
							<Option iconColor="darkGray">
								<div>
									<Icons type="edit" />
								</div>
							</Option>
							<Option iconColor="pink">
								<div>
									<Icons type="delete" />
								</div>
							</Option>
						</OwnerOptions>
					)}
				</Author>

				<PublishedDate>
					Publicado em {new Date(story.date).toLocaleDateString("pt-br")}
				</PublishedDate>

				<Background.Div />

				<Form title={story.title} body={story.body} />

				<Background.Div />

				<StoryOptions>
					{owner.isOwner && (
						<>
							<Option iconColor="">
								<span>{compactNumber(story.likes)} pessoas gostaram</span>
							</Option>

							<Option iconColor="pastelBlue">
								<div onClick={() => setShowComment((prev) => !prev)}>
									<Icons type="comment" options={{ color: "#70A4A2" }} />
									<span>Comentários</span>
								</div>
								<span>{compactNumber(story.comments)}</span>
							</Option>
						</>
					)}

					{!owner.isOwner && (
						<>
							<Option iconColor="red">
								<div>
									{like && <Icons type="unlike" onClick={toggleLike} />}
									{!like && <Icons type="like" onClick={toggleLike} />}
									<span>Gostei</span>
								</div>
								<span>{compactNumber(story.likes)}</span>
							</Option>

							<Option iconColor="pastelBlue">
								<div onClick={() => setShowComment((prev) => !prev)}>
									<Icons type="comment" options={{ color: "#70A4A2" }} />
									<span>Comentar</span>
								</div>
								<span>{compactNumber(story.comments)}</span>
							</Option>

							<Option iconColor="pink" onClick={() => setModalIsOpen(true)}>
								<div>
									<Icons type="denounce" options={{ color: "#A65353" }} />
									<span>Denunciar</span>
								</div>
							</Option>
						</>
					)}
				</StoryOptions>
			</Background>

			<Comments storyId={story.id} showComment={showComment} />
		</>
	);
}

const Author = styled.div`
	height: 50px;
	display: flex;
	align-items: center;
	margin-bottom: 10px;

	> div {
		display: flex;
		flex-direction: column;
		margin: 0 0 0 14px;

		span {
			font-size: 1.1rem;
			color: ${(props) => props.theme.colors.black};
		}
	}
`;

const Channel = styled.span`
	&& {
		font-size: 0.76rem;
		font-weight: 500;
		line-height: 20px;
		color: ${(props) => props.theme.colors.blue};
	}
`;

const PublishedDate = styled.span`
	font-size: 0.76rem;
	color: ${(props) => props.theme.colors.mediumGraySecond};
`;

const StoryOptions = styled.div`
	width: 100%;
	height: 34px;
	margin: 0;
	display: flex;
	align-content: center;
	justify-content: space-evenly;
`;

const Option = styled.div<OptionProps>`
	display: flex;
	flex-direction: column;
	align-content: center;
	justify-content: center;
	text-align: center;
	margin: 0 1rem;

	> div {
		display: flex;
		align-content: center;
		justify-content: center;
		font-size: 1.05rem;
		font-weight: 700;
		color: ${(props) => props.theme.colors.mediumGraySecond};

		span {
			cursor: pointer;
		}

		svg {
			font-size: 1.1rem;
			margin-right: 5px;
			color: ${(props) => props.theme.colors[props.iconColor]};
			cursor: pointer;
		}
	}

	> span {
		font-size: 0.8rem;
		margin-top: 5px;
		color: ${(props) => props.theme.colors.mediumGraySecond};
	}

	@media (max-width: 650px) {
		> div {
			font-size: 0.9rem;
		}
	}

	@media (max-width: 400px) {
		> div {
			font-size: 0px;

			svg {
				font-size: 1.3rem;
			}
		}
	}
`;

const Following = styled.div`
	&& {
		margin: 0 0 0 auto;
		align-self: flex-start;

		span {
			font-size: 0.9rem;
			font-weight: 700;
			color: ${(props) => props.theme.colors.pastelBlue};
		}

		@media (max-width: 400px) {
			span {
				font-size: 0.8rem;
			}
		}
	}
`;

const OwnerOptions = styled.div`
	&& {
		display: flex;
		align-self: flex-start;
		flex-direction: inherit;
		margin: 0 0 0 auto;

		svg {
			font-size: 1.3rem;
		}

		@media (max-width: 400px) {
			svg {
				font-size: 1.3rem;
			}
		}
	}
`;
