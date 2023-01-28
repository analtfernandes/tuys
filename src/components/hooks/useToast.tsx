import { ToastContainer, toast as toastify } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useThemeContext } from "../../contexts";

type ToastParams = {
	text?: string;
	type?: "info" | "success" | "error" | "warning";
};

export { ToastContainer };

export function useToast() {
	const { theme } = useThemeContext();

	return ({ text, type }: ToastParams) => {
		const message =
			text ||
			"Um erro ocorreu, por favor tente novamente ou recarregue a página.";
		const toastTheme = theme.name === "light" ? "light" : "dark";

		if (type) {
			toastify[type](message, { theme: toastTheme });
			return;
		}

		toastify(message, { theme: toastTheme });
	};
}
