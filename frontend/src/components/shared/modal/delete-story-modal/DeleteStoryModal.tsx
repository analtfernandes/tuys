import { Form } from "../../form";
import { ModalBase } from "../modal-base";
import { DeleteStoryModalParams } from "./types";

function DeleteStoryModal({
	story,
	config,
	callback,
}: Readonly<DeleteStoryModalParams>) {
	return (
		<ModalBase
			config={config}
			callback={callback}
			title="Apagar Estória"
			trigger="Apagar"
			content={
				<Form.Section>
					<p>
						Você tem certeza que deseja apagar a estória <b>{story.name}</b>?
					</p>
					<p>
						<b>Atenção:</b> essa ação <u>não</u> pode ser desfeita!
					</p>
				</Form.Section>
			}
		/>
	);
}

export { DeleteStoryModal };
