import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeContextProvider } from "../../contexts/ThemeContext";
import { ToastContainer } from "../utils/Toast";

import { PrivatePage } from "../privatePage/PrivatePage";
import { Header } from "../header/Header";
import { Footer } from "../footer/Footer";
import { HomePage } from "../../pages/home/Home";
import { ChannelsPage } from "../../pages/channels/Channels";
import { RankingPage } from "../../pages/ranking/Ranking";
import { NotificationsPage } from "../../pages/notifications/Notifications";
import { MePage } from "../../pages/me/Me";
import { SettingsPage } from "../../pages/settings/Settings";
import { Stories } from "../stories/Stories";

function App() {
	return (
		<BrowserRouter>
			<ThemeContextProvider>
				<ToastContainer />

				<PrivatePage>
					<Header />
					<Footer />

					<Routes>
						<Route path="/" element={<HomePage />} />
						<Route path="/channels" element={<ChannelsPage />} />
						<Route
							path="/channels/:channelName"
							element={<Stories path="channel" />}
						/>
						<Route path="/ranking" element={<RankingPage />} />
						<Route path="/notifications" element={<NotificationsPage />} />
						<Route path="/me" element={<MePage />} />
						<Route path="/settings" element={<SettingsPage />} />
					</Routes>
				</PrivatePage>
			</ThemeContextProvider>
		</BrowserRouter>
	);
}

export default App;
