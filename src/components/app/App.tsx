import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "../header/Header";
import { Footer } from "../footer/Footer";
import { ThemeContextProvider } from "../../contexts/ThemeContext";

function App() {
	return (
		<BrowserRouter>
			<ThemeContextProvider>
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
			</ThemeContextProvider>
		</BrowserRouter>
	);
}

export default App;
