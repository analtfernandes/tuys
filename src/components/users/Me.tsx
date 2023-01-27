import { useEffect, useState } from "react";
import api from "../../services/tuys";
import { useThemeContext } from "../../contexts";
import { MyDataType } from "../utils/Protocols";
import { Icons, toast } from "../utils";
import { PageStyle } from "./PageStyle";
import { Stories } from "../stories/Stories";

export function Me() {
	const [user, setUser] = useState({} as MyDataType);
	const { theme } = useThemeContext();

	useEffect(() => {
		api
			.getMyData()
			.then((user) => setUser(user))
			.catch(({ response }) => {
				toast({
					theme: theme.name,
					type: "error",
					text:
						response?.data?.message ||
						"Não foi possível buscar os dados. Por favor, recarregue a página",
				});
			});
	}, [theme.name]);

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
