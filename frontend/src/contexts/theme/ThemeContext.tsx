import { createContext, useContext, useReducer } from "react";
import { ThemeProvider } from "styled-components";
import { GlobalStyle } from "../../assets/styles/globalstyles";
import { palette } from "../../assets/styles/palettes";
import { contextError } from "../contextError";
import { useLocalStorage } from "../../hooks";
import {
	ThemeContextType,
	ReducerAction,
	GetDefaultThemeParams,
	ThemeTypeName,
	ThemeType,
} from "./types";

const { theme: themes } = palette;

const ThemeContext = createContext<ThemeContextType>(null);

function reducer(theme: ThemeType, action: ReducerAction) {
	return themes[action.type] || themes.light;
}

function getDefaultTheme({
	localData,
	addInLocalStorage,
}: GetDefaultThemeParams) {
	if (!localData?.theme) {
		addInLocalStorage({ theme: "light" });
		return themes.light;
	}

	if (!localData.token) return themes.light;

	return themes[localData.theme] || themes.light;
}

function ThemeContextProvider({ children }: React.PropsWithChildren) {
	const { localData, addInLocalStorage } = useLocalStorage();
	const [theme, dispatch] = useReducer(
		reducer,
		getDefaultTheme({ localData, addInLocalStorage })
	);

	function changeTheme(theme: ThemeTypeName) {
		addInLocalStorage({ theme });
		return dispatch({ type: theme });
	}

	function setLocalTheme(theme: ThemeTypeName) {
		return dispatch({ type: theme });
	}

	return (
		<ThemeContext.Provider value={{ theme, changeTheme, setLocalTheme }}>
			<ThemeProvider theme={theme}>
				<GlobalStyle variant={theme} />
				{children}
			</ThemeProvider>
		</ThemeContext.Provider>
	);
}

function useThemeContext() {
	const context = useContext(ThemeContext);
	if (!context) throw contextError("Theme");
	return context;
}

export { ThemeContextProvider, useThemeContext };
