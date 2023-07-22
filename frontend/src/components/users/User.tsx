import styled from "styled-components";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUserContext } from "../../contexts";
import { api } from "../../services";
import { useRequestMutation, useRequestQuery, useToast } from "../../hooks";
import { RequestKeyEnum } from "../utils/enums";
import { Icons } from "../utils";
import { Loading } from "../shared";
import { PageStyle } from "./PageStyle";
import { Stories } from "../stories/Stories";
import { FollowPage } from "../follow/Follow";

type PageStateValues = "stories" | "likedStories" | "followers" | "following";

export function User() {
	const [page, setPage] = useState<PageStateValues>("stories");
	const { user: localUser } = useUserContext();
	const toast = useToast();
	const params = useParams();
	const userId = Number(params.userId) || null;

	const { data: user, ...requestUser } = useRequestQuery(
		[RequestKeyEnum.user, userId],
		getUserData
	);
	const requestFollow = useRequestMutation([RequestKeyEnum.user], () =>
		api.postFollow(user?.id || 0)
	);
	const requestUnfollow = useRequestMutation([RequestKeyEnum.user], () =>
		api.postUnfollow(user?.id || 0)
	);
	const requestUnban = useRequestMutation([RequestKeyEnum.user], () =>
		api.postUnban(user?.id || 0)
	);

	const pages = {
		stories: <Stories path="user" />,
		followers: <FollowPage type="followers" userId={user?.id} />,
		following: <FollowPage type="following" userId={user?.id} />,
		likedStories: <Stories path="user" userStories={{ liked: true }} />,
	};

	useEffect(() => setPage("stories"), [userId]);

	if (requestUser.isError) {
		toast({
			type: "error",
			text:
				requestUser.error ||
				"Não foi possível buscar os dados. Por favor, recarregue a página",
		});
	}

	function getUserData() {
		if (!userId || isNaN(userId) || userId <= 0) {
			throw new Error("Um erro ocorreu!", {
				cause: {
					message: "Id de usuário inválido!",
					status: 400,
				},
			});
		}
		return api.getUserData(userId);
	}

	function toggleFollow() {
		const isLoading = requestFollow.isLoading || requestUnfollow.isLoading;

		if (user && !isLoading) {
			if (!user.isFollowing) {
				requestFollow.mutate(user.id);
				return;
			}
			requestUnfollow.mutate(user.id);
		}
	}

	if (requestFollow.isError) {
		toast({
			type: "error",
			text: `Não foi possível seguir ${user?.username}. Tente novamente.`,
		});
		requestFollow.reset();
	}

	if (requestUnfollow.isError) {
		toast({
			type: "error",
			text: `Não foi possível parar de seguir ${user?.username}. Tente novamente.`,
		});
		requestUnfollow.reset();
	}

	function handleUnban() {
		if (user && !requestUnban.isLoading) {
			requestUnban.mutate(user.id);
		}
	}

	if (requestUnban.isError) {
		toast({
			type: "error",
			text:
				requestUnban.error ||
				`Não foi possível desbanir ${user?.username}. Tente novamente.`,
		});
		requestUnban.reset();
	}

	return (
		<PageStyle>
			<>
				{requestUser.isLoading && <Loading />}

				{user && (
					<>
						<PageStyle.Header
							color={user.rankColor}
							avatar={user.avatar}
							username={user.username}
						/>

						<PageStyle.Sections>
							<PageStyle.User>
								{user.status === "BANNED" && localUser.isAdmin && (
									<Unban onClick={handleUnban}>Desbanir</Unban>
								)}

								{localUser.status !== "BANNED" &&
									!user.isUser &&
									user.isFollowing && (
										<Follow onClick={toggleFollow}>
											<Icons type="unfollow" />
											<span>Parar de seguir</span>
										</Follow>
									)}

								{localUser.status !== "BANNED" &&
									!user.isUser &&
									!user.isFollowing && (
										<Follow onClick={toggleFollow}>
											<Icons type="follow" />
											<span>Seguir</span>
										</Follow>
									)}

								<p>
									<Icons type="me" />
									<b>Sobre mim</b>
								</p>
								<span>{user.about}</span>
								<p>
									<Icons type="rank" />
									<b>Rank: </b>
									<span
										style={
											user.rankName !== "Admin"
												? {
														color: user.rankColor,
												  }
												: {
														backgroundImage: user.rankColor,
														backgroundClip: "text",
														WebkitTextFillColor: "transparent",
												  }
										}
									>
										{user.rankName}
									</span>
								</p>

								<button onClick={() => setPage("stories")}>
									<Icons type="createdStories" />
									<b>Total de contos criados: </b>
									<span>{user.createdStories}</span>
								</button>

								<button onClick={() => setPage("likedStories")}>
									<Icons type="unlike" />
									<b>Histórias curtidas: </b>
									<span>{user.likedStories}</span>
								</button>

								<button onClick={() => setPage("followers")}>
									<Icons type="follower" />
									<b>Seguidores: </b>
									<span>{user.followers}</span>
								</button>

								<button onClick={() => setPage("following")}>
									<Icons type="following" />
									<b>Segue: </b>
									<span>{user.following}</span>
								</button>

								<p>
									<Icons type="status" />
									<b>Status: </b>
									<span
										style={{
											color: user.status === "BANNED" ? "#f70000" : "#04ee04",
										}}
									>
										{user.status === "BANNED" ? "banido" : "ativo"}
									</span>
								</p>
							</PageStyle.User>

							{pages[page]}
						</PageStyle.Sections>
					</>
				)}
			</>
		</PageStyle>
	);
}

const Follow = styled.div`
	&& {
		width: fit-content;
		display: flex;
		align-items: center;
		margin-top: 20px;
		color: ${(props) => props.theme.colors.blue};
		font-weight: 700;
		cursor: pointer;

		svg {
			margin-right: 10px;
		}
	}
`;

const Unban = styled.button`
	&& {
		width: 10rem;
		height: 2rem;
		margin-top: 20px;
		display: initial;
		border-radius: 10px;
		border: 1px solid ${(props) => props.theme.colors.pink};
		background-color: ${(props) => props.theme.colors.background};
		text-align: center;
		font-weight: 700;
		color: ${(props) => props.theme.colors.pink};
		cursor: pointer;
		outline: none;

		:hover,
		:focus {
			filter: brightness(0.7);
		}
	}
`;
