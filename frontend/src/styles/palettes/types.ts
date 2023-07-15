type ThemeType = {
	name: string;
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

		white: string;
		lightGray: string;
		mediumGrayPrimary: string;
		mediumGraySecond: string;
		darkGray: string;
		black: string;
	};
};

type ThemeTypeName = "light" | "dark" | "melancholic" | "highlight";

export type { ThemeType, ThemeTypeName };
