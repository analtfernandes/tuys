import api from "../../services/tuys";
import { Icons } from "../utils";
import { PageStyle } from "./PageStyle";
import { Stories } from "../stories/Stories";
import { useRequestQuery, useToast } from "../../hooks";
import { RequestKeyEnum } from "../utils/enums";
import { useUserContext } from "../../contexts/UserContext";

export function Me() {
	const { user: userData } = useUserContext();
	const toast = useToast();

	const {
		isError,
		isSuccess,
		data: user,
		...request
	} = useRequestQuery([RequestKeyEnum.user, userData.username], () =>
		api.getMyData()
	);

	if (isError) {
		toast({
			type: "error",
			text:
				request.error ||
				"Não foi possível buscar os dados. Por favor, recarregue a página",
		});
		return null;
	}

	if (!user) {
		return null;
	}

	return (
		<PageStyle>
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
						<span style={{ color: user.rankColor }}>{user.rankName}</span>
					</p>
					<p>
						<Icons type="createdStories" />
						<b>Total de contos criados: </b>
						<span>{user.createdStories}</span>
					</p>
					<p>
						<Icons type="bannedBooks" />
						<b>Total de contos banidos: </b>
						<span>{user.bannedStories}</span>
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
		</PageStyle>
	);
}
