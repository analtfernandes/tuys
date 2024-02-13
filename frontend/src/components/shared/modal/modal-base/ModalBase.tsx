import ReactModal from "react-modal";
import { Button } from "../../button";
import { ModalBaseParams } from "./types";
import { Buttons, Form, Wrapper } from "./styles";

ReactModal.setAppElement("#root");

function ModalBase({
	title,
	content,
	trigger,
	config: { modalConfig, handleCloseModal },
	callback,
}: Readonly<ModalBaseParams>) {
	const wrapperStyle = {
		overlay: { zIndex: 15, backgroundColor: "rgba(0, 0, 0, 0.5)" },
	};

	function submitForm(event: React.FormEvent<HTMLFormElement>) {
		callback(event);
		handleCloseModal();
	}

	return (
		<Wrapper
			isOpen={modalConfig.isOpen}
			onRequestClose={handleCloseModal}
			style={wrapperStyle}
			shouldCloseOnOverlayClick={false}
		>
			<Form onSubmit={submitForm}>
				<Form.Title>{title}</Form.Title>

				<Form.Division margin="15px 0" />

				{content}

				<Buttons>
					<Button type="primary-invert" onClick={handleCloseModal}>
						Cancelar
					</Button>

					<Button type="primary">{trigger}</Button>
				</Buttons>
			</Form>
		</Wrapper>
	);
}

export { ModalBase };
