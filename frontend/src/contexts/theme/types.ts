import { ThemeType, ThemeTypeName } from "../../assets/styles/palettes";
import { CallbackType } from "../../components/utils/Protocols";
import { LocalStorageType } from "../../hooks/local-storage/types";

type ThemeContextType = {
	theme: ThemeType;
	changeTheme: CallbackType;
	setLocalTheme: CallbackType;
} | null;

type ReducerAction = {
	type: ThemeTypeName;
};

type GetDefaultThemeParams = {
	localData: LocalStorageType;
	addInLocalStorage: CallbackType;
};

export type {
	ThemeContextType,
	ReducerAction,
	GetDefaultThemeParams,
	ThemeTypeName,
	ThemeType,
};
