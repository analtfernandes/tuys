import {
	createContext,
	PropsWithChildren,
	useContext,
	useReducer,
} from "react";
import { ThemeProvider } from "styled-components";
import { contextError } from "./contextError";
import GlobalStyle from "../styles/globalStyles";
import { palette, ThemeType } from "../styles/palettes";
import { CallbackType, LocalStorageType } from "../components/utils/Protocols";
import { useLocalStorage } from "../hooks";

type ThemeContextType = {
	theme: ThemeType;
	changeTheme: CallbackType;
	setLocalTheme: CallbackType;
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

	if (action.type === "melancholic") {
		return themes.melancholic;
	}

	if (action.type === "highlight") {
		return themes.highlight;
	}

	return themes.light;
}

type GetDefaultThemeParams = {
	localData: LocalStorageType;
	addInLocalStorage: CallbackType;
};

function getDefaultTheme({
	localData,
	addInLocalStorage,
}: GetDefaultThemeParams) {
	if (!localData || !localData.theme) {
		addInLocalStorage({ theme: "light" });
		return themes.light;
	}

	if (!localData.token) {
		return themes.light;
	}

	return themes[localData.theme] || themes.light;
}

export function ThemeContextProvider({ children }: PropsWithChildren) {
	const { localData, addInLocalStorage } = useLocalStorage();
	const [theme, dispatch] = useReducer(
		reducer,
		getDefaultTheme({ localData, addInLocalStorage })
	);

	function changeTheme(theme: "light" | "dark" | "melancholic" | "highlight") {
		addInLocalStorage({ theme });
		return dispatch({ type: theme });
	}

	function setLocalTheme(theme: string) {
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

export function useThemeContext() {
	const context = useContext(ThemeContext);
	if (!context) throw contextError("Theme");
	return context;
}
