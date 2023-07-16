import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useThemeContext } from "../../contexts";
import { ThemesMap, ToastParams } from "./types";

function useToast() {
	const { theme } = useThemeContext();
	const themesMap: ThemesMap = {
		light: "light",
		dark: "dark",
		melancholic: "dark",
		highlight: "dark",
	};

	return ({ text, type }: ToastParams) => {
		const toastTheme = { theme: themesMap[theme.name] };

		if (type) {
			toast[type](text, toastTheme);
			return;
		}

		toast(text, toastTheme);
	};
}

export { ToastContainer, useToast };
