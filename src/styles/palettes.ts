export type PaletteType = {
	body: {
		background: string;
	};
	header: {
		background: string;
		color: string;
	};
	footer: {
		background: string;
		color: string;
	};
};

const light = Object.freeze({
	body: {
		background: "#f2f2f2",
	},
	header: {
		background: "#f2d6b3",
		color: "#0D0D0D",
	},
	footer: {
		background: "#f2f2f2",
		color: "#0D0D0D",
	},
});

export const palette = { light };
