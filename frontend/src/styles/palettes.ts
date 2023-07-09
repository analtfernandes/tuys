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

export type ThemeTypeName = "light" | "dark" | "melancholic" | "highlight";

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
			text: neutralPallet.lightGray,
			primary: "#2a012b",
			secundary: neutralPallet.white,
			blue: "#3c9f9c",
			pastelBlue: "#395756",
			rosewater: "#2a012b",
			pastelPink: "#A65353",
			pink: "#BD8682",
			red: "#FF0000",
			white: neutralPallet.black,
			lightGray: neutralPallet.mediumGraySecond,
			mediumGrayPrimary: neutralPallet.mediumGraySecond,
			mediumGraySecond: neutralPallet.mediumGrayPrimary,
			darkGray: neutralPallet.lightGray,
			black: neutralPallet.white,
		},
	},
	melancholic: {
		name: "melancholic",
		colors: {
			background: "#07001a",
			text: neutralPallet.lightGray,
			primary: "#070435",
			secundary: neutralPallet.white,
			blue: "#3c9f9c",
			pastelBlue: "#035958",
			rosewater: "#070435",
			pastelPink: "#A65353",
			pink: "#F7827A",
			red: "#FF0000",
			white: "#0E1426",
			lightGray: "#092637",
			mediumGrayPrimary: neutralPallet.mediumGrayPrimary,
			mediumGraySecond: neutralPallet.mediumGrayPrimary,
			darkGray: neutralPallet.lightGray,
			black: neutralPallet.white,
		},
	},
	highlight: {
		name: "highlight",
		colors: {
			background: neutralPallet.black,
			text: neutralPallet.white,
			primary: "#dd5715",
			secundary: neutralPallet.white,
			blue: "purple",
			pastelBlue: "#3b0091",
			rosewater: "#dd5715",
			pastelPink: "#21C413",
			pink: "#FF0000",
			red: "#FF0000",
			white: neutralPallet.lightGray,
			lightGray: neutralPallet.mediumGrayPrimary,
			mediumGrayPrimary: neutralPallet.mediumGraySecond,
			mediumGraySecond: neutralPallet.mediumGraySecond,
			darkGray: neutralPallet.darkGray,
			black: neutralPallet.darkGray,
		},
	},
};

export const palette = { theme };
