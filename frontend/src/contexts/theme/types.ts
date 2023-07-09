import { ThemeType, ThemeTypeName } from "../../styles/palettes";
import {
	CallbackType,
	LocalStorageType,
} from "../../components/utils/Protocols";

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
