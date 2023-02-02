import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
	ThemeContextProvider,
	QueryClientContextProvider,
	UserContextProvider,
} from "../../contexts";
import { ToastContainer } from "../hooks";

import { PrivatePage } from "../privatePage/PrivatePage";
import { Header } from "../header/Header";
import { Footer } from "../footer/Footer";
import { HomePage } from "../../pages/home/Home";
import { ChannelsPage } from "../../pages/channels/Channels";
import { RankingPage } from "../../pages/ranking/Ranking";
import { NotificationsPage } from "../../pages/notifications/Notifications";
import { MePage } from "../../pages/me/Me";
import { SettingsPage } from "../../pages/settings/Settings";
import { UserPage } from "../../pages/user/User";
import { Stories } from "../stories/Stories";
import { Settings, Perfil } from "../settings";

function App() {
	return (
		<BrowserRouter>
			<ThemeContextProvider>
				<QueryClientContextProvider>
					<ToastContainer />

					<UserContextProvider>
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
								<Route path="/user/:userId" element={<UserPage />} />
								<Route path="/settings" element={<SettingsPage />}>
									<Route path="" element={<Settings />} />
									<Route path="perfil" element={<Perfil />} />
								</Route>
							</Routes>
						</PrivatePage>
					</UserContextProvider>
				</QueryClientContextProvider>
			</ThemeContextProvider>
		</BrowserRouter>
	);
}

export default App;
