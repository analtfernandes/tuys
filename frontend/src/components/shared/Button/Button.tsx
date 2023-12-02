import { Loading } from "../Loading";

import { Wrapper } from "./styles";
import { ButtonParams } from "./types";

function Button({
	children,
	type,
	isLoading,
	...other
}: Readonly<ButtonParams>) {
	const defaultConfig = {
		padding: "0",
		height: "40px",
		margin: "0 auto",
		buttonType: type ?? "primary",
		radius: type === "secundary" ? "50px" : "10px",
		width: type === "secundary" ? "100%" : "111px",
	};

	return (
		<Wrapper {...defaultConfig} {...other}>
			{isLoading ? <Loading size="small" /> : children}
		</Wrapper>
	);
}

export { Button };
