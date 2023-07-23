import {
	BrowserRouter,
	Routes,
	Route,
	Outlet,
	Navigate,
} from "react-router-dom";
import {
	ThemeContextProvider,
	QueryClientContextProvider,
	UserContextProvider,
} from "../../contexts";
import { ToastContainer } from "../../hooks";

import SignUp from "../sign/SignUp";
import SignIn from "../sign/SignIn";
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
import { Perfil, Themes } from "../settings";
import { NotFoundError } from "../errors/NotFoundError";

function App() {
	return (
		<BrowserRouter>
			<ThemeContextProvider>
				<QueryClientContextProvider>
					<ToastContainer />

					<UserContextProvider>
						<Routes>
							<Route path="/sign-up" element={<SignUp />} />
							<Route path="/sign-in" element={<SignIn />} />

							<Route
								path="/"
								element={
									<PrivatePage>
										<Header />
										<Outlet />
										<Footer />
									</PrivatePage>
								}
							>
								<Route path="" element={<HomePage />} />
								<Route path="channels" element={<ChannelsPage />} />

								<Route
									path="channels/:channelName"
									element={<Stories path="channel" />}
								/>

								<Route path="ranking" element={<RankingPage />} />
								<Route path="notifications" element={<NotificationsPage />} />
								<Route path="me" element={<MePage />} />
								<Route path="user/:userId" element={<UserPage />} />

								<Route path="settings" element={<SettingsPage />}>
									<Route path="perfil" element={<Perfil />} />
									<Route path="themes" element={<Themes />} />
									<Route path="*" element={<Navigate to="perfil" />} />
								</Route>
							</Route>

							<Route path="*" element={<NotFoundError />} />
						</Routes>
					</UserContextProvider>
				</QueryClientContextProvider>
			</ThemeContextProvider>
		</BrowserRouter>
	);
}

export default App;
