import ReactModal from "react-modal";
import styled from "styled-components";
import { Form as SharedForm } from "../../form";

const Wrapper = styled(ReactModal)`
	&& {
		width: 90%;
		max-width: 400px;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 auto;
	}
`;

const Form = styled(SharedForm)`
	&& {
		width: 100%;

		p {
			color: ${(props) => props.theme.colors.text};
			margin: 3px 0;
		}
	}
`;

const Buttons = styled.div`
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 30px auto 0;

	@media (max-width: 450px) {
		flex-direction: column-reverse;
		justify-content: space-between;
		height: 90px;
	}
`;

export { Wrapper, Form, Buttons };
