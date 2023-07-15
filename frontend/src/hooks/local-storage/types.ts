import { ThemeTypeName } from "../../assets/styles/palettes";

type LocalStorageType = {
	id: number;
	username: string;
	avatar: string;
	token: string;
	theme: ThemeTypeName;
};

export type { LocalStorageType };
