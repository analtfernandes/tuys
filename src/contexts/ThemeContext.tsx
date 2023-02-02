import {
	createContext,
	PropsWithChildren,
	useContext,
	useReducer,
} from "react";
import { ThemeProvider } from "styled-components";
import { contextError } from "./contextErros";
import GlobalStyle from "../styles/globalStyles";
import { palette, ThemeType } from "../styles/palettes";
import { CallbackType, LocalStorageType } from "../components/utils/Protocols";

type ThemeContextType = {
	theme: ThemeType;
	changeTheme: CallbackType;
} | null;

type ReducerAction = {
	type: string;
};

const { theme: themes } = palette;

const ThemeContext = createContext<ThemeContextType>(null);

function reducer<Type>(theme: Type, action: ReducerAction) {
	if (action.type === "light") {
		return themes.light;
	}

	if (action.type === "dark") {
		return themes.dark;
	}

	return themes.light;
}

function saveTheme(theme: string) {
	const localStorageKey = "tuys.com";
	const localdata = JSON.parse(localStorage.getItem(localStorageKey) || "");

	localStorage.setItem(
		localStorageKey,
		JSON.stringify({ ...localdata, theme })
	);
}

function getDefaultTheme() {
	const localStorageKey = "tuys.com";
	const localdata = JSON.parse(
		localStorage.getItem(localStorageKey) || ""
	) as LocalStorageType;

	if (!localdata || !localdata.theme) {
		localStorage.setItem(
			localStorageKey,
			JSON.stringify({ ...localdata, theme: "light" })
		);
		return themes.light;
	}

	return themes[localdata.theme];
}

export function ThemeContextProvider({ children }: PropsWithChildren) {
	const [theme, dispatch] = useReducer(reducer, getDefaultTheme());

	function changeTheme(theme: string) {
		saveTheme(theme);
		return dispatch({ type: theme });
	}

	return (
		<ThemeContext.Provider value={{ theme, changeTheme }}>
			<ThemeProvider theme={theme}>
				<GlobalStyle variant={theme} />
				{children}
			</ThemeProvider>
		</ThemeContext.Provider>
	);
}

export function useThemeContext() {
	const context = useContext(ThemeContext);
	if (!context) throw contextError("Theme");
	return context;
}
