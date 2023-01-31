import styled from "styled-components";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../images/logo.png";
import { useUserContext } from "../../contexts/UserContext";
import api from "../../services/tuys";
import { RequestKeyEnum } from "../utils/enums";
import { useRequestQuery } from "../hooks";
import { Icons } from "../utils";
import { Search } from "./Search";

export function Header() {
	const [isSearching, setIsSearching] = useState(false);
	const [windowWidth, setWindowWidth] = useState(0);
	const [haveNewNotification, setHaveNewNotification] = useState(false);

	const { user } = useUserContext();
	const { data: notifications } = useRequestQuery(
		[RequestKeyEnum.notifications, user.username],
		() => api.getNotifications()
	);

	useEffect(() => {
		const { innerWidth } = window;
		setWindowWidth(innerWidth);
	}, []);

	if (notifications && !notifications[0].read && !haveNewNotification) {
		setHaveNewNotification(true);
	}

	return (
		<>
			<Wrapper>
				<img src={logo} alt="TUYS" />

				<div>
					{isSearching && <Search />}
					<Icons
						type="search"
						onClick={() => setIsSearching((prev) => !prev)}
					/>

					{windowWidth >= 500 && (
						<>
							<Link to="/">
								<Icons type="home" />
							</Link>

							<Link to="/channels">
								<Icons type="channels" />
							</Link>

							<Link to="/ranking">
								<Icons type="ranking" />
							</Link>

							<Link to="/notifications">
								<Icons type="notification" />
								{haveNewNotification && <div></div>}
							</Link>

							<Link to="/me">
								<Icons type="me" />
							</Link>

							<Link to="/settings">
								<Icons type="settings" />
							</Link>
						</>
					)}
				</div>
			</Wrapper>
		</>
	);
}

const Wrapper = styled.section`
	width: 100%;
	height: 65px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 1.4em;
	position: fixed;
	top: 0;
	left: 0;
	z-index: 2;
	box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
	background-color: ${(props) => props.theme.colors.primary};

	> img {
		height: 55px;
	}

	> div {
		display: flex;
		align-items: center;

		svg {
			height: 23px;
			width: 23px;
			margin-left: 20px;
			color: ${(props) => props.theme.colors.secundary};
			cursor: pointer;
		}
	}

	a {
		position: relative;

		> div {
			width: 10px;
			height: 10px;
			border-radius: 50px;
			position: absolute;
			top: 0;
			right: 0;
			background-color: ${(props) => props.theme.colors.red};
		}
	}

	@media (max-width: 500px) {
		> div {
			svg {
				height: 25px;
				width: 25px;
			}
		}
	}
`;
