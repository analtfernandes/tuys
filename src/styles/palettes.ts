export type ThemeType = {
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

const neutralPallet = {
	white: "#F2F2F2",
	lightGray: "#D2D2D2",
	mediumGrayPrimary: "#A6A6A6",
	mediumGraySecond: "#595959",
	darkGray: "#262626",
	black: "#0D0D0D",
};

const theme = {
	light: {
		name: "light",
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
			red: "#FF0000",
			...neutralPallet,
		},
	},
	dark: {
		name: "dark",
		colors: {
			background: neutralPallet.darkGray,
			text: neutralPallet.white,
			primary: "#f2d6b3",
			secundary: neutralPallet.white,
			blue: "#2B7B8C",
			pastelBlue: "#70A4A2",
			rosewater: "#F2D6B3",
			pastelPink: "#D9B3B0",
			pink: "#A65353",
			red: "#FF0000",
			...neutralPallet,
			white: neutralPallet.black,
		},
	},
};

export const palette = { theme };
