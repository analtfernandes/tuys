import {
	createContext,
	PropsWithChildren,
	useContext,
	useReducer,
} from "react";
import { ThemeProvider } from "styled-components";
import { contextError } from "./contextErros";
import GlobalStyle from "../styles/globalStyles";
import { palette, PaletteType } from "../styles/palettes";

type ThemeContextType = {
	theme: PaletteType;
	changeTheme: (theme: string) => void;
} | null;

type ReducerAction = {
	type: string;
};

const ThemeContext = createContext<ThemeContextType>(null);

function reducer<Type>(theme: Type, action: ReducerAction) {
	if (action.type === "light") {
		return palette.light;
	}

	return palette.light;
}

export function ThemeContextProvider({ children }: PropsWithChildren) {
	const [theme, dispatch] = useReducer(reducer, palette.light);

	function changeTheme(theme: string) {
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
