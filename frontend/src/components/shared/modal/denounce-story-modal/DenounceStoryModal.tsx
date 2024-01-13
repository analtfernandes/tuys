import { useForm } from "../../../../hooks";
import { Form } from "../../form";
import { ModalBase } from "../modal-base";
import { DenounceStoryModalParams } from "./types";

function DenounceStoryModal({
	config,
	callback,
}: Readonly<DenounceStoryModalParams>) {
	const { form, handleChange, handleForm, clearForm } = useForm();

	function submitForm(event: React.FormEvent<HTMLFormElement>) {
		handleForm(event, callback);
		clearForm();
	}

	return (
		<ModalBase
			config={config}
			callback={submitForm}
			title="Denunciar Estória"
			trigger="Denunciar"
			content={
				<Form.Section>
					<label>
						Motivo<sup>*</sup>
						<textarea
							required
							name="text"
							placeholder="Motivo da denúncia..."
							autoComplete="off"
							minLength={3}
							maxLength={200}
							value={form?.text || ""}
							onChange={handleChange}
						/>
					</label>
				</Form.Section>
			}
		/>
	);
}

export { DenounceStoryModal };
