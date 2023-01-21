export type ThemeType = {
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
		lightGrey: string;
		mediumGrayPrimary: string;
		mediumGraySecond: string;
		darkGray: string;
		black: string;
	};
};

const neutralPallet = {
	white: "#F2F2F2",
	lightGrey: "#D2D2D2",
	mediumGrayPrimary: "#A6A6A6",
	mediumGraySecond: "#595959",
	darkGray: "#262626",
	black: "#0D0D0D",
};

const theme = {
	light: {
		colors: {
			background: neutralPallet.white,
			text: neutralPallet.darkGray,
			primary: "#f2d6b3",
			secundary: neutralPallet.black,
			blue: "#2B7B8C",
			pastelBlue: "#70A4A2",
			rosewater: "#F2D6B3",
			pastelPink: "#D9B3B0",
			pink: "#A65353",
			...neutralPallet,
		},
	},
};

export const palette = { theme };
