import styled from "styled-components";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/tuys";
import { useRequestMutation, useRequestQuery, useToast } from "../../hooks";
import { RequestKeyEnum } from "../utils/enums";
import { Icons } from "../utils";
import { Loading } from "../shared";
import { PageStyle } from "./PageStyle";
import { Stories } from "../stories/Stories";
import { FollowPage } from "../follow/Follow";

type PageStateValues = "stories" | "followers" | "following";

export function User() {
	const toast = useToast();
	const [page, setPage] = useState<PageStateValues>("stories");
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

	const pages = {
		stories: <Stories path="user" />,
		followers: <FollowPage type="followers" userId={user?.id} />,
		following: <span>seguindo</span>,
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
								{!user.isUser && user.isFollowing && (
									<Follow onClick={toggleFollow}>
										<Icons type="unfollow" />
										<span>Parar de seguir</span>
									</Follow>
								)}

								{!user.isUser && !user.isFollowing && (
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
