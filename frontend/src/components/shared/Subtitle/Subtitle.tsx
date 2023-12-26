import { Wrapper } from "./styles";

function Subtitle({ children }: Readonly<React.PropsWithChildren>) {
	return <Wrapper>{children}</Wrapper>;
}

export { Subtitle };
