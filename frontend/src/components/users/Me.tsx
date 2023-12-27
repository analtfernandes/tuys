import { useState } from "react";
import { useUserContext } from "../../contexts/user/UserContext";
import { api } from "../../services";
import { useRequestQuery, useToast } from "../../hooks";
import { RequestKeyEnum } from "../utils/enums";
import { Icons } from "../utils";
import { Loading } from "../shared";
import { PageStyle } from "./PageStyle";
import { Stories } from "../stories/Stories";
import { FollowPage } from "../follow/Follow";

type PageStateValues =
	| "stories"
	| "bannedStories"
	| "likedStories"
	| "followers"
	| "following";

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
		bannedStories: <Stories path="user" userStories={{ status: "BANNED" }} />,
		followers: <FollowPage type="followers" />,
		following: <FollowPage type="following" />,
		likedStories: <Stories path="user" userStories={{ liked: true }} />,
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
						<PageStyle.Header user={user} />

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
