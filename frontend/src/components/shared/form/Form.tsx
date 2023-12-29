import { Card } from "../card";

import { FormParams, SectionParams } from "./types";
import { Wrapper, Title, Section, Division } from "./styles";

function Form({ children, onSubmit, ...other }: Readonly<FormParams>) {
	return (
		<Card margin="0 0 20px 0">
			<Wrapper onSubmit={onSubmit} {...other}>
				{children}
			</Wrapper>
		</Card>
	);
}

Form.Title = ({
	children,
	...other
}: React.PropsWithChildren & { [key: string]: any }) => {
	return <Title {...other}>{children}</Title>;
};

Form.Section = ({ children, ...other }: SectionParams) => {
	const defaultConfig = {
		margin: "10px 0",
		textarea: { min: "70px", max: "100px" },
	};

	return (
		<Section {...defaultConfig} {...other}>
			{children}
		</Section>
	);
};

Form.Division = ({ margin = "10px 0" }) => {
	return <Division margin={margin}></Division>;
};

export { Form };
