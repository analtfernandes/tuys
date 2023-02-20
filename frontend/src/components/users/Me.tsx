import { useState } from "react";
import api from "../../services/tuys";
import { Icons } from "../utils";
import { PageStyle } from "./PageStyle";
import { Stories } from "../stories/Stories";
import { useRequestQuery, useToast } from "../../hooks";
import { RequestKeyEnum } from "../utils/enums";
import { useUserContext } from "../../contexts/UserContext";
import { Loading } from "../shared";

type PageStateValues = "stories" | "bannedStories" | "followers" | "following";

export function Me() {
	const [page, setPage] = useState<PageStateValues>("stories");
	const { user: userData } = useUserContext();
	const toast = useToast();

	const {
		isError,
		isLoading,
		data: user,
		...request
	} = useRequestQuery([RequestKeyEnum.user, userData.username], () =>
		api.getMyData()
	);

	const pages = {
		stories: <Stories path="user" />,
		bannedStories: <Stories path="user" status='BANNED' />,
		followers: <span>seguidores</span>,
		following: <span>seguindo</span>,
	};

	if (isError) {
		toast({
			type: "error",
			text:
				request.error ||
				"Não foi possível buscar os dados. Por favor, recarregue a página",
		});
	}

	return (
		<PageStyle>
			<>
				{isLoading && <Loading />}

				{user && (
					<>
						<PageStyle.Header
							color={user.rankColor}
							avatar={user.avatar}
							username={user.username}
						/>

						<PageStyle.Sections>
							<PageStyle.User>
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

								<button onClick={() => setPage("bannedStories")}>
									<Icons type="bannedBooks" />
									<b>Total de contos banidos: </b>
									<span>{user.bannedStories}</span>
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
