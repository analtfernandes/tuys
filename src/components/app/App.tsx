import { BrowserRouter, Routes, Route } from "react-router-dom";
import GlobalStyle from "../styles/globalStyles";
import { Header } from "../header/Header";
import { Footer } from "../footer/Footer";

function App() {
	return (
		<BrowserRouter>
			<GlobalStyle />

			<Header />
			<Footer />

			<Routes>
				<Route path="/" />
				<Route path="/channels" />
				<Route path="/ranking" />
				<Route path="/notifications" />
				<Route path="/me" />
				<Route path="/settings" />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
