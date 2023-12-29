import styled from "styled-components";
import ReactModal from "react-modal";
import { CallbackType, SetState } from "../utils/Protocols";
import { Button } from "./button";
import { Form } from "./form";
import { useForm } from "../../hooks";
import { test } from "./Modal/test";

ReactModal.setAppElement("#root");

type ModalParams = {
	modalIsOpen: boolean;
	type: ModalType;
	setModalIsOpen: SetState<ModalSetStateType>;
	callback?: CallbackType;
	closeModalOnSubmit?: boolean;
	defaultForm?: ModalForm;
	storyData?: {
		name: string;
	};
	channelData?: {
		name: string;
	};
};

export type ModalSetStateType = {
	isOpen: boolean;
	type: ModalType;
};

type ModalType = "denounceStory" | "delete" | "createChannel" | "deleteChannel";

type ModalForm = {
	text?: string;
	name?: string;
	background?: string;
};

export function Modal({
	closeModalOnSubmit = true,
	modalIsOpen,
	type,
	storyData,
	channelData,
	defaultForm,
	setModalIsOpen,
	callback,
}: Readonly<ModalParams>) {
	const { form, handleChange, handleForm, clearForm } = useForm(defaultForm);
	console.log(test());

	const modalTypeOptions = {
		denounceStory: {
			title: "Denunciar Estória",
			content: (
				<Form.Section>
					<label>
						Motivo<em>*</em>
					</label>
					<textarea
						required
						autoComplete="off"
						minLength={3}
						maxLength={200}
						placeholder="Motivo da denúncia..."
						name="text"
						value={form?.text || ""}
						onChange={handleChange}
					/>
				</Form.Section>
			),
			continueButtonText: "Denunciar",
		},
		delete: {
			title: "Apagar Estória",
			content: (
				<Form.Section>
					<p>
						Você tem certeza que deseja apagar
						<b>{storyData?.name ? ` ${storyData?.name}` : ""}</b>?
					</p>
					<p>
						<b>Atenção:</b> essa ação <u>não</u> pode ser desfeita!
					</p>
				</Form.Section>
			),
			continueButtonText: "Apagar",
		},
		// createChannel: {
		// 	title: "Criar Canal",
		// 	content: (
		// 		<>
		// 			<Form.Section>
		// 				<label>
		// 					Nome<em>*</em>
		// 				</label>
		// 				<input
		// 					required
		// 					autoComplete="off"
		// 					minLength={3}
		// 					maxLength={20}
		// 					type="text"
		// 					placeholder="Nome do canal..."
		// 					name="name"
		// 					value={form?.name || ""}
		// 					onChange={handleChange}
		// 				/>
		// 			</Form.Section>
		// 			<Form.Section>
		// 				<label>
		// 					Imagem<em>*</em>
		// 				</label>
		// 				<input
		// 					required
		// 					autoComplete="off"
		// 					type="url"
		// 					placeholder="Imagem de fundo..."
		// 					name="background"
		// 					value={form?.background || ""}
		// 					onChange={handleChange}
		// 				/>
		// 			</Form.Section>
		// 		</>
		// 	),
		// 	continueButtonText: "Enviar",
		// },
		createChannel: {
			content: test().props.children.find((c: any) => c.props?.id === "content")?.props?.children,
			title: test().props.children.find((c: any) => c.props?.id === "title")?.props?.children,
			continueButtonText: test().props.children.find((c: any) => c.props?.id === "trigger")?.props?.children,
		},
		deleteChannel: {
			title: "Apagar Canal",
			content: (
				<Form.Section>
					<p>
						Você tem certeza que deseja apagar o canal
						<b>{channelData?.name ? ` ${channelData?.name}` : ""}</b>?
					</p>
					<p>
						<b>Atenção:</b> essa ação <u>não</u> pode ser desfeita!
					</p>
				</Form.Section>
			),
			continueButtonText: "Apagar",
		},
	};

	const data = modalTypeOptions[type];

	function submitForm(event: React.FormEvent<HTMLFormElement>) {
		handleForm(event, callback);
		clearForm();

		if (closeModalOnSubmit) closeModal();
	}

	function closeModal() {
		setModalIsOpen((prev) => ({ ...prev, isOpen: false }));
	}

	return (
		<Wrapper
			isOpen={modalIsOpen}
			onRequestClose={closeModal}
			style={{ overlay: { zIndex: 15, backgroundColor: "rgba(0, 0, 0, 0.5)" } }}
			shouldCloseOnOverlayClick={false}
		>
			<FormStyle onSubmit={submitForm}>
				<Form.Title>{data.title}</Form.Title>

				<Form.Division margin="15px 0" />

				{data.content}

				<Buttons>
					<Button type="primary-invert" onClick={closeModal}>
						Cancelar
					</Button>

					<Button type="primary">{data.continueButtonText}</Button>
				</Buttons>
			</FormStyle>
		</Wrapper>
	);
}

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

const FormStyle = styled(Form)`
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
