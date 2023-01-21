import { ToastContainer, toast as toastify } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type ToastParams = {
	text?: string;
	type?: "info" | "success" | "error" | "warning";
	theme: string;
};

export { ToastContainer };

export function toast({ text, type, theme }: ToastParams) {
	const message =
		text ||
		"Um erro ocorreu, por favor tente novamente ou recarregue a página.";
	const toastTheme = theme === "light" ? "light" : "dark";

	if (type) {
		toastify[type](message, { theme: toastTheme });
		return;
	}

	toastify(message, { theme: toastTheme });
}
