import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useUserContext } from "../../contexts/UserContext";
import api from "../../services/tuys";
import { useRequestQuery } from "../hooks";
import { UserRank } from "../shared";
import { Icons } from "../utils";

export function Search() {
	const { user } = useUserContext();
	const [search, setSearch] = useState("");
	const navigate = useNavigate();
	const { data: users } = useRequestQuery(
		["users", search, user.username],
		() => api.getUsers(search)
	);

	function goToUserPage(id: number) {
		setSearch("");
		navigate(`/user/${id}`);
	}

	return (
		<Wrapper>
			<input
				required
				autoComplete="off"
				type="text"
				placeholder="Pesquisar..."
				value={search || ""}
				onChange={(e) => setSearch(e.target.value)}
			/>
			<Icons type="search" />

			{search.length > 0 && (
				<Users>
					<>
						{users &&
							users.map((user, index) => (
								<User key={index} onClick={() => goToUserPage(user.id)}>
									<UserRank
										background={user.rankColor}
										image={user.avatar}
										alt={user.username}
										size="small"
									/>

									<span>
										{user.username} {user.isUser && <em>{` (você)`}</em>}
									</span>

									{user.following && (
										<Following>
											<span>Seguindo</span>
										</Following>
									)}
								</User>
							))}
						{users && users.length === 0 && (
							<span>Nenhum resultado encontrado!</span>
						)}
					</>
				</Users>
			)}
		</Wrapper>
	);
}

const Wrapper = styled.div`
	&& {
		width: 400px;
		height: 40px;
		transition: linear 0.1s;
		position: relative;
		z-index: 2;

		input {
			width: 100%;
			height: 100%;
			outline: none;
			border-radius: 50px;
			padding: 0 45px 0 15px;
			border: 1px solid ${(props) => props.theme.colors.mediumGraySecond};
			background-color: ${(props) => props.theme.colors.white};
			color: ${(props) => props.theme.colors.mediumGraySecond};
			font-size: 1.01rem;

			::placeholder {
				color: ${(props) => props.theme.colors.mediumGrayPrimary};
				font-style: italic;
			}
		}

		svg {
			font-size: 1.01rem;
			position: absolute;
			right: 15px;
			top: calc(40px - 2.02rem);
			color: ${(props) => props.theme.colors.mediumGraySecond};
		}

		@media (max-width: 840px) {
			width: 300px;
		}

		@media (max-width: 730px) {
			width: 270px;
		}

		@media (max-width: 680px) {
			width: 70vw;
			position: absolute;
			top: 80px;
			right: calc(75vw - 60vw);
		}
	}
`;

const Users = styled.div`
	width: 100%;
	height: auto;
	max-height: 200px;
	padding: 10px 0;
	margin: 0;
	border-radius: 8px;
	background-color: ${(props) => props.theme.colors.lightGray};
	transform: translateY(3px);
	position: relative;
	z-index: 1;
	text-align: center;
	overflow-y: scroll;
	overflow-x: hidden;

	& > span {
		font-size: 0.9rem;
		color: ${(props) => props.theme.colors.black};
	}
`;

const User = styled.div`
	width: 100%;
	height: 50px;
	display: flex;
	padding: 0 20px;
	align-items: center;
	background-color: ${(props) => props.theme.colors.lightGray};
	font-size: 1.1rem;
	color: ${(props) => props.theme.colors.black};
	cursor: default;

	span {
		margin: 0 0 0 12px;

		em {
			font-size: 1rem;
			color: ${(props) => props.theme.colors.mediumGraySecond};
			font-style: italic;
		}
	}

	&:hover {
		filter: brightness(0.9);
	}

	@media (max-width: 400px) {
		font-size: 0.9rem;
	}
`;

const Following = styled.div`
	&& {
		height: 100%;
		margin: 0 0 0 auto;
		align-self: flex-start;
		display: flex;
		align-items: center;

		span {
			font-size: 0.8rem;
			font-weight: 700;
			color: ${(props) => props.theme.colors.pastelBlue};
		}

		@media (max-width: 400px) {
			span {
				font-size: 0.7rem;
			}
		}
	}
`;
