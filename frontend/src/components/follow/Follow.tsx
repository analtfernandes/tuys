import styled from "styled-components";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/tuys";
import { FollowType } from "../utils/Protocols";
import { useToast } from "../../hooks";
import { Loading, Title, UserRank } from "../shared";

type FollowParams = {
	type: "followers" | "following";
	userId?: number;
};

type ApiFunctions = {
	followers: {
		me: ApiFunctionName;
		otherUser: ApiFunctionName;
	};
	following: {
		me: ApiFunctionName;
		otherUser: ApiFunctionName;
	};
};
type ApiFunctionName =
	| "getUserFollowers"
	| "getMyFollowers"
	| "getWhoIFollow"
	| "getWhoUserFollow";

export function FollowPage({ type, userId = 0 }: FollowParams) {
	const [followList, setFollowList] = useState<FollowType[] | null>(null);
	const toast = useToast();

	useEffect(() => {
		const apiFunctions: ApiFunctions = {
			followers: {
				me: "getMyFollowers",
				otherUser: "getUserFollowers",
			},
			following: {
				me: "getWhoIFollow",
				otherUser: "getWhoUserFollow",
			},
		};

		const whoseFollow = userId ? "otherUser" : "me";
		let apiFunctionName: ApiFunctionName = apiFunctions[type][whoseFollow];

		api[apiFunctionName](userId)
			.then((response) => {
				if (response) {
					setFollowList(response);
					return;
				}
				toast({
					type: "error",
					text: "Não foi possível buscar os dados. Por favor, tente novamente.",
				});
			})
			.catch((error) =>
				toast({
					type: "error",
					text:
						error?.cause?.message ||
						"Não foi possível buscar os dados. Por favor, tente novamente.",
				})
			);
	}, [type, userId]);

	return (
		<main>
			<Wrapper>
				<Title>{type === "followers" ? "Seguidores" : "Segue"}</Title>

				{!followList && <Loading />}

				<div>
					{type === "followers" && followList && followList.length === 0 && (
						<span>
							{userId
								? "Usuário ainda não tem nenhum seguidor. Que tal ser o primeiro?"
								: "Você ainda não tem nenhum seguidor."}
						</span>
					)}

					{type === "following" && followList && followList.length === 0 && (
						<span>
							{userId
								? "Usuário ainda não segue ninguém."
								: "Você ainda não segue ninguém."}
						</span>
					)}

					{followList &&
						followList.length > 0 &&
						followList.map(({ id, username, avatar, rankColor }, index) => (
							<Link to={`/user/${id}`} key={index}>
								<UserRank
									background={rankColor}
									image={avatar}
									alt={username}
									size="large"
								/>
							</Link>
						))}
				</div>
			</Wrapper>
		</main>
	);
}

const Wrapper = styled.section`
	width: 100%;
	min-width: 400px;
	height: 100%;
	margin: 0 auto;

	> div {
		display: flex;
		flex-wrap: wrap;
		margin-bottom: 80px;

		> a {
			display: flex;
			align-items: center;
			justify-content: center;
			margin: 5px;
			padding: 5px;
			border-radius: 10px;
		}
	}

	@media (max-width: 900px) {
		width: 90%;
		margin: 0;
	}

	@media (max-width: 860px) {
		width: 80%;
		margin: 0;
	}

	@media (max-width: 800px) {
		width: 100%;
		min-width: 100%;
		margin: 0 auto;
	}
`;
