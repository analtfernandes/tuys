import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeContextProvider } from "../../contexts/ThemeContext";

import { PrivatePage } from "../privatePage/PrivatePage";
import { Header } from "../header/Header";
import { Footer } from "../footer/Footer";
import { Home } from "../../pages/home/Home";
import { Channels } from "../../pages/channels/Channels";
import { Ranking } from "../../pages/ranking/Ranking";
import { Notifications } from "../../pages/notifications/Notifications";
import { Me } from "../../pages/me/Me";
import { Settings } from "../../pages/settings/Settings";

function App() {
	return (
		<BrowserRouter>
			<ThemeContextProvider>
				<PrivatePage>
					<Header />
					<Footer />

					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/channels" element={<Channels />} />
						<Route path="/ranking" element={<Ranking />} />
						<Route path="/notifications" element={<Notifications />} />
						<Route path="/me" element={<Me />} />
						<Route path="/settings" element={<Settings />} />
					</Routes>
				</PrivatePage>
			</ThemeContextProvider>
		</BrowserRouter>
	);
}

export default App;
