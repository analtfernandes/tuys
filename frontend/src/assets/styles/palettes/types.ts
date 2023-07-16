type ThemeType = {
	name: ThemeTypeName;
	colors: {
		background: string;
		text: string;

		primary: string;
		secundary: string;

		blue: string;
		pastelBlue: string;
		rosewater: string;
		pastelPink: string;
		pink: string;
		red: string;

		white: string;
		lightGray: string;
		mediumGrayPrimary: string;
		mediumGraySecond: string;
		darkGray: string;
		black: string;
	};
};

type ThemeTypeName = "light" | "dark" | "melancholic" | "highlight";

type PaletteType = {
	[theme in ThemeTypeName]: ThemeType;
};

export type { ThemeType, ThemeTypeName, PaletteType };
