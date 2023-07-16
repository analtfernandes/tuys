import { ThemeTypeName } from "../../assets/styles/palettes";

type ToastThemes = "light" | "dark";

type ToastTypes = "info" | "success" | "error" | "warning";

type ToastParams = {
	text: string;
	type?: ToastTypes;
};

type ThemesMap = {
	[name in ThemeTypeName]: ToastThemes;
};

export type { ToastThemes, ToastTypes, ToastParams, ThemesMap };
