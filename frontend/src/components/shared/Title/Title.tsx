import { Wrapper } from "./styles";

function Title({ children }: React.PropsWithChildren) {
	return <Wrapper>{children}</Wrapper>;
}

export { Title };
