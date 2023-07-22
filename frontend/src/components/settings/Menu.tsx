import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useThemeContext, useUserContext } from "../../contexts";
import { api, UserType } from "../../services";
import { useLocalStorage, useToast } from "../../hooks";
import { Icons } from "../utils";
import { Title } from "../shared";

type WrapperProps = {
	showMenu: boolean;
};

export function Menu() {
	const toast = useToast();
	const { setUser } = useUserContext();
	const { setLocalTheme } = useThemeContext();
	const { clearLocalStorage } = useLocalStorage();
	const navigate = useNavigate();
	const location = useLocation();

	function showMenu() {
		const isMainPage =
			location.pathname === "/settings" || location.pathname === "/settings/";
		const isMobileWidth = window.innerWidth <= 500;
		return isMainPage || !isMobileWidth;
	}

	function logout() {
		api
			.postSignOut()
			.then(() => {
				toast({
					type: "success",
					text: "Logout realizado com sucesso!",
				});
				toast({
					type: "success",
					text: "Volte mais tarde para nos contar suas histórias! :)",
				});

				clearLocalStorage();
				setUser({} as UserType);
				setLocalTheme("light");

				navigate("/sign-in");
			})
			.catch((error) => {
				toast({
					type: "error",
					text:
						error?.cause?.message ||
						"Não foi possível deslogar. Por favor, tente novamente.",
				});
			});
	}

	return (
		<Wrapper showMenu={showMenu()}>
			<Title>Configurações</Title>

			<Option onClick={() => navigate("/settings/perfil")}>
				<div>
					<Icons type="me" />
					<span>Perfil</span>
				</div>
				<Icons type="continue" />
			</Option>

			<Option onClick={() => navigate("/settings/themes")}>
				<div>
					<Icons type="theme" />
					<span>Temas</span>
				</div>
				<Icons type="continue" />
			</Option>

			<Option onClick={() => logout()}>
				<div>
					<Icons type="exit" />
					<span>Sair</span>
				</div>
			</Option>
		</Wrapper>
	);
}

const Wrapper = styled.div<WrapperProps>`
	width: 40%;
	max-width: 260px;
	min-width: 200px;
	height: 100vh;
	position: fixed;
	background-color: ${(props) => props.theme.colors.pastelBlue};
	display: ${(props) => (props.showMenu ? "initial" : "none")};
	cursor: default;

	> h1 {
		margin-left: 20px;
	}

	@media (max-width: 500px) {
		width: 100%;
		max-width: 100%;
		height: fit-content;
		margin-bottom: 20px;
		background-color: ${(props) => props.theme.colors.background};
	}
`;

const Option = styled.div`
	width: 100%;
	height: fit-content;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 10px;
	background-color: ${(props) => props.theme.colors.pastelBlue};
	color: #f2f2f2;
	font-size: 1.2rem;

	:hover {
		filter: brightness(0.9);
	}

	> div {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	span {
		margin-left: 10px;
	}

	svg {
		font-size: 1.4rem;
	}

	@media (max-width: 500px) {
		font-size: 1.1rem;

		svg {
			font-size: 1.3rem;
		}
	}
`;
