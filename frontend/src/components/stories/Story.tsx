import styled from "styled-components";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../contexts";
import { api, StoryType } from "../../services";
import { useRequestMutation, useToast } from "../../hooks";
import { RequestKeyEnum } from "../utils/enums";
import { Icons } from "../utils";
import { Background, Modal, ModalSetStateType, UserRank } from "../shared";
import { Form } from "./Form";
import { Comments } from "../comments/Comments";

type StoryParams = {
	story: StoryType;
	showChannel: boolean;
};

type OptionProps = {
	iconColor: string;
	banned?: boolean;
};

export function Story({ story, showChannel = true }: StoryParams) {
	const navigate = useNavigate();
	const { user } = useUserContext();
	const requestKey = [RequestKeyEnum.stories, RequestKeyEnum.story];
	const requestLike = useRequestMutation(requestKey, () =>
		api.postLike(story.id)
	);
	const requestUnlike = useRequestMutation(requestKey, () =>
		api.postUnlike(story.id)
	);
	const requestDenounce = useRequestMutation(requestKey, (param) =>
		api.postDenounce(param)
	);
	const requestDelete = useRequestMutation(requestKey, () =>
		api.deleteStory(story.id)
	);

	const [like, setLike] = useState(story.likedByUser);
	const [editing, setEditing] = useState(false);
	const [showComment, setShowComment] = useState(false);
	const [modalConfig, setModalConfig] = useState({
		isOpen: false,
		type: "delete",
	} as ModalSetStateType);
	const toast = useToast();
	const { owner } = story;

	useEffect(() => setShowComment(false), [story]);

	function compactNumber(number: number) {
		return Intl.NumberFormat("pt-br", {
			notation: "compact",
		}).format(number);
	}

	function toggleLike() {
		if (!like) {
			setLike(true);
			requestLike.mutate(story.id);
			return;
		}

		setLike(false);
		requestUnlike.mutate(story.id);
	}

	if (requestLike.isError) {
		setLike(false);
		requestLike.reset();
	}

	if (requestUnlike.isError) {
		setLike(true);
		requestUnlike.reset();
	}

	function denounceStory({ text }: { text: string }) {
		if (text.length < 3) {
			toast({
				type: "error",
				text: "A mensagem deve ter pelo menos 3 caracteres!",
			});
			return;
		}

		const param = { storyId: story.id, body: { text } };
		requestDenounce.mutate(param);
	}

	if (requestDenounce.isSuccess) {
		toast({
			type: "success",
			text: "Denuncia enviada com sucesso. Agradecemos pela contribuição.",
		});
		requestDenounce.reset();
	}

	if (requestDenounce.isError) {
		toast({
			type: "error",
			text:
				requestDenounce.error ||
				"Não foi possível enviar a denúncia. Tente novamente.",
		});
		requestDenounce.reset();
	}

	function deleteStoryFunction() {
		requestDelete.mutate(story.id);
	}

	if (requestDelete.isSuccess) {
		toast({
			type: "success",
			text: "História apagada com sucesso.",
		});
		requestDelete.reset();
	}

	if (requestDelete.isError) {
		toast({
			type: "error",
			text:
				requestDelete.error || "Não foi apagar a história. Tente novamente.",
		});
		requestDelete.reset();
	}

	return (
		<>
			{modalConfig.isOpen && modalConfig.type === "denounceStory" && (
				<Modal
					type="denounceStory"
					modalIsOpen={modalConfig.isOpen}
					setModalIsOpen={setModalConfig}
					callback={denounceStory}
				/>
			)}

			{modalConfig.isOpen && modalConfig.type === "delete" && (
				<Modal
					type="delete"
					modalIsOpen={modalConfig.isOpen}
					setModalIsOpen={setModalConfig}
					callback={deleteStoryFunction}
					storyData={{ name: story.title }}
				/>
			)}

			{story.status === "ACTIVE" && (
				<Background config={{ margin: "20px 0" }}>
					<Author>
						<UserRank
							background={owner.rankColor}
							image={owner.avatar}
							alt={owner.username}
							onClick={() => navigate(`/user/${story.userId}`)}
							style={{ cursor: "pointer" }}
						/>

						<div>
							<span
								onClick={() => navigate(`/user/${story.userId}`)}
								style={{ cursor: "pointer" }}
							>
								{owner.username}
							</span>
							{showChannel && <Channel>#{story.channel.toUpperCase()}</Channel>}
						</div>

						{!owner.isOwner && story.followedByUser && (
							<Following>
								<span>Seguindo</span>
							</Following>
						)}

						{owner.isOwner && user.status !== "BANNED" && (
							<OwnerOptions>
								<Option
									iconColor="darkGray"
									onClick={() => (editing ? "" : setEditing(true))}
								>
									<div>
										<Icons type="edit" />
									</div>
								</Option>
								<Option
									iconColor="pink"
									onClick={() =>
										setModalConfig({ isOpen: true, type: "delete" })
									}
								>
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

					<Form
						id={story.id}
						story={story}
						editing={user.status === "BANNED" ? false : editing}
						setEditing={setEditing}
					/>

					<Background.Div />

					<StoryOptions>
						{(owner.isOwner || user.status === "BANNED") && (
							<>
								<Option iconColor="">
									<span>{compactNumber(story.likes)} pessoas gostaram</span>
								</Option>

								<Option iconColor="pastelBlue">
									<div onClick={() => setShowComment((prev) => !prev)}>
										<Icons type="comment" />
										<span>Comentários</span>
									</div>
									<span>{compactNumber(story.comments)}</span>
								</Option>
							</>
						)}

						{!owner.isOwner && user.status !== "BANNED" && (
							<>
								<Option iconColor="red">
									<div onClick={toggleLike}>
										{like && <Icons type="unlike" />}
										{!like && <Icons type="like" />}
										<span>Gostei</span>
									</div>
									<span>{compactNumber(story.likes)}</span>
								</Option>

								<Option iconColor="pastelBlue">
									<div onClick={() => setShowComment((prev) => !prev)}>
										<Icons type="comment" />
										<span>Comentar</span>
									</div>
									<span>{compactNumber(story.comments)}</span>
								</Option>

								<Option
									iconColor="pink"
									onClick={() =>
										setModalConfig({ isOpen: true, type: "denounceStory" })
									}
								>
									<div>
										<Icons type="denounce" />
										<span>Denunciar</span>
									</div>
								</Option>
							</>
						)}
					</StoryOptions>
				</Background>
			)}

			{story.status === "BANNED" && (
				<Background
					config={{ margin: "20px 0" }}
					style={{ filter: "sepia(0.5)", cursor: "default" }}
				>
					<Author>
						<UserRank
							background={owner.rankColor}
							image={owner.avatar}
							alt={owner.username}
						/>

						<div>
							<span>{owner.username}</span>
							<Channel>#{story.channel.toUpperCase()}</Channel>
						</div>
					</Author>

					<PublishedDate>
						Publicado em {new Date(story.date).toLocaleDateString("pt-br")}
					</PublishedDate>

					<Background.Div />

					<Form
						id={story.id}
						story={story}
						editing={false}
						setEditing={setEditing}
					/>

					<Background.Div />

					<StoryOptions>
						<Option iconColor="red" banned={true}>
							<div>
								{like && <Icons type="unlike" />}
								{!like && <Icons type="like" />}
								<span>Gostei</span>
							</div>
							<span>{compactNumber(story.likes)}</span>
						</Option>

						<Option
							iconColor="pastelBlue"
							banned={true}
							onClick={() => setShowComment((prev) => !prev)}
						>
							<div>
								<Icons type="comment" />
								<span>Comentar</span>
							</div>
							<span>{compactNumber(story.comments)}</span>
						</Option>

						<Option iconColor="pink" banned={true}>
							<div>
								<Icons type="denounce" />
								<span>Denunciar</span>
							</div>
						</Option>
					</StoryOptions>
				</Background>
			)}

			{showComment && (
				<Comments
					storyId={story.id}
					storyIsBanned={story.status === "BANNED" || user.status === "BANNED"}
				/>
			)}
		</>
	);
}

const Author = styled.div`
	width: 100%;
	height: 50px;
	display: flex;
	align-items: center;
	margin-bottom: 10px;

	> div {
		width: 50%;
		display: flex;
		flex-direction: column;
		margin: 0 0 0 14px;

		span {
			font-size: 1.1rem;
			line-break: anywhere;
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
			cursor: ${(props) => (props.banned ? "default" : "pointer")};
		}

		svg {
			font-size: 1.1rem;
			margin-right: 5px;
			color: ${(props) => props.theme.colors[props.iconColor]};
			cursor: ${(props) => (props.banned ? "default" : "pointer")};
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
		width: fit-content;
		margin: 0 0 0 auto;
		align-self: flex-start;

		span {
			font-size: 0.9rem;
			font-weight: 700;
			color: ${(props) => props.theme.colors.pastelBlue};
			line-break: normal;
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
		width: fit-content;
		display: flex;
		align-self: flex-start;
		flex-direction: inherit;
		margin: 0 0 0 auto;

		svg {
			font-size: 1.3rem;
		}

		> div {
			margin: 0;
		}

		@media (max-width: 400px) {
			svg {
				font-size: 1.3rem;
			}
		}
	}
`;
