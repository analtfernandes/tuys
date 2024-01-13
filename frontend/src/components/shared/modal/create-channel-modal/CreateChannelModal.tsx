import { useForm } from "../../../../hooks";
import { Form } from "../../form";
import { ModalBase } from "../modal-base";
import { CreateChannelModalParams } from "./types";

function CreateChannelModal({
	defaultForm,
	config,
	callback,
}: Readonly<CreateChannelModalParams>) {
	const { form, handleChange, handleForm, clearForm } = useForm(defaultForm);

	function submitForm(event: React.FormEvent<HTMLFormElement>) {
		handleForm(event, callback);
		clearForm();
	}

	return (
		<ModalBase
			config={config}
			callback={submitForm}
			title="Criar Canal"
			trigger="Enviar"
			content={
				<>
					<Form.Section>
						<label>
							Nome<sup>*</sup>
							<input
								required
								type="text"
								name="name"
								placeholder="Insira o nome do canal"
								autoComplete="off"
								minLength={3}
								maxLength={20}
								value={form?.name || ""}
								onChange={handleChange}
							/>
						</label>
					</Form.Section>
					<Form.Section>
						<label>
							Imagem<sup>*</sup>
							<input
								required
								type="url"
								name="background"
								placeholder="Insira a imagem de fundo"
								autoComplete="off"
								value={form?.background || ""}
								onChange={handleChange}
							/>
						</label>
					</Form.Section>
				</>
			}
		/>
	);
}

export { CreateChannelModal };
