import styled from "styled-components";
import { useParams } from "react-router-dom";
import api from "../../services/tuys";
import { useRequestMutation, useRequestQuery, useToast } from "../../hooks";
import { RequestKeyEnum } from "../utils/enums";
import { Icons } from "../utils";
import { Loading } from "../shared";
import { PageStyle } from "./PageStyle";
import { Stories } from "../stories/Stories";

export function User() {
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
			throw new Error(
				JSON.stringify({
					message: "Id de usuário inválido!",
					status: 400,
				})
			);
		}
		return api.getUserData(userId);
	}

	function toggleFollow() {
		if (user) {
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
								<p>
									<Icons type="createdStories" />
									<b>Total de contos criados: </b>
									<span>{user.createdStories}</span>
								</p>
								<p>
									<Icons type="follower" />
									<b>Seguidores: </b>
									<span>{user.followers}</span>
								</p>
								<p>
									<Icons type="following" />
									<b>Segue: </b>
									<span>{user.following}</span>
								</p>
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

							<Stories path="user" />
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
