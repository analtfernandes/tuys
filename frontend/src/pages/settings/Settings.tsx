import styled from "styled-components";
import { Outlet } from "react-router-dom";
import { Menu } from "../../components/settings/Menu";

export function SettingsPage() {
	return (
		<Wrapper>
			<Menu />

			<Outlet />
		</Wrapper>
	);
}

const Wrapper = styled.main`
	&& {
		display: flex;
		flex-direction: row;

		> section {
			width: 50%;
			max-width: 700px;
			margin: 0 auto;
			padding-bottom: 70px;
			position: absolute;
			left: 45%;
		}

		@media (max-width: 500px) {
			flex-direction: column;

			> section {
				width: 90%;
				left: 5%;
			}
		}

		@media (min-width: 850px) {
			> section {
				left: 350px;;
			}
		}
	}
`;
