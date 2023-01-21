import styled from "styled-components";
import { Link } from "react-router-dom";
import { Icons } from "../utils/Icons";
import logo from "../images/logo.png";

export function Header() {
	return (
		<Wrapper>
			<img src={logo} alt="TUYS" />

			<div>
				<Icons type="search" />

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
				</Link>

				<Link to="/me">
					<Icons type="me" />
				</Link>

				<Link to="/settings">
					<Icons type="settings" />
				</Link>
			</div>
		</Wrapper>
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
	box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
	background-color: ${(props) => props.theme.colors.primary};

	> img {
		height: 55px;
	}

	> div {
		svg {
			height: 23px;
			width: 23px;
			margin-left: 20px;
			color: ${(props) => props.theme.colors.secundary};
			cursor: pointer;
		}
	}

	@media (max-width: 500px) {
		> div {
			width: 25px;
			height: 25px;
			overflow: hidden;

			svg {
				height: 25px;
				width: 25px;
				margin: 0;
			}
		}
	}
`;
