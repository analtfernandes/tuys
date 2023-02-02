import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useThemeContext } from "../../contexts";
import { Icons } from "../utils";
import { Title } from "../shared";

export function Themes() {
	const navigate = useNavigate();
	const { theme, changeTheme } = useThemeContext();

	const themes = {
		light: "light",
		dark: "dark",
	};

	function handleChange(newTheme: string) {
		if (newTheme !== theme.name) {
			changeTheme(newTheme);
		}
	}

	return (
		<Wrapper>
			<Menu onClick={() => navigate("/settings")}>
				{window.innerWidth <= 500 && <Icons type="return" />}
				<Title>Temas</Title>
			</Menu>

			<ul>
				<li>
					<input
						type="radio"
						checked={theme.name === themes.light}
						onChange={() => handleChange(themes.light)}
					/>
					<span>Light</span>
				</li>
				<li>
					<input
						type="radio"
						checked={theme.name === themes.dark}
						onChange={() => handleChange(themes.dark)}
					/>
					<span>Dark</span>
				</li>
			</ul>
		</Wrapper>
	);
}

const Wrapper = styled.section`
	&& {
		&& {
			width: 100%;
		}
	}

	ul {
		li {
			width: 100%;
			height: fit-content;
			padding: 10px;
			color: ${(props) => props.theme.colors.text};
			font-size: 1.2rem;

			input {
				accent-color: ${(props) => props.theme.colors.pink};
                cursor: pointer;
			}

			span {
				margin-left: 10px;
			}

			@media (max-width: 500px) {
				font-size: 1.1rem;
				color: ${(props) => props.theme.colors.white};
				background-color: ${(props) => props.theme.colors.pastelBlue};
			}
		}
	}
`;

const Menu = styled.div`
	margin-left: 20px;
	width: fit-content;
	display: flex;
	align-items: center;
	cursor: pointer;

	svg {
		font-size: 1.3rem;
		margin-right: 5px;
		color: ${(props) => props.theme.colors.text};
	}
`;
