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
import { CallbackType } from "../components/utils/Protocols";

type ThemeContextType = {
	theme: ThemeType;
	changeTheme: CallbackType;
} | null;

type ReducerAction = {
	type: string;
};

const {
	theme: { light },
} = palette;

const ThemeContext = createContext<ThemeContextType>(null);

function reducer<Type>(theme: Type, action: ReducerAction) {
	if (action.type === "light") {
		return light;
	}

	return light;
}

export function ThemeContextProvider({ children }: PropsWithChildren) {
	const [theme, dispatch] = useReducer(reducer, light);

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
