import { Outlet } from "react-router-dom";
import { Menu } from "../../components/settings/Menu";

export function SettingsPage() {
	return (
		<main>
			<Menu />

			<Outlet />
		</main>
	);
}
