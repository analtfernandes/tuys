import { CardParams, CardDivParams } from "./types";
import { Wrapper, Division } from "./styles";

function Card({ children, ...other }: Readonly<CardParams>) {
	function hexToRGB(hex: string, alpha = 1) {
		const red = parseInt(hex.slice(1, 3), 16);
		const green = parseInt(hex.slice(3, 5), 16);
		const blue = parseInt(hex.slice(5, 7), 16);

		return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
	}

	return (
		<Wrapper
			{...other}
			width={other.width || "100%"}
			margin={other.margin || "0"}
			getBorderColor={hexToRGB}
		>
			{children}
		</Wrapper>
	);
}

Card.Div = ({ margin }: CardDivParams) => {
	return <Division margin={margin || "10px 0"}></Division>;
};

export { Card };
