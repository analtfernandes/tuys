import { Form } from "../../form";
import { ModalBase } from "../modal-base";
import { DeleteChannelModalParams } from "./types";

function DeleteChannelModal({
	channel,
	config,
	callback,
}: Readonly<DeleteChannelModalParams>) {
	return (
		<ModalBase
			config={config}
			callback={callback}
			title="Apagar Canal"
			trigger="Apagar"
			content={
				<Form.Section>
					<p>
						Você tem certeza que deseja apagar o canal <b>{channel.name}</b>?
					</p>
					<p>
						<b>Atenção:</b> essa ação <u>não</u> pode ser desfeita!
					</p>
				</Form.Section>
			}
		/>
	);
}

export { DeleteChannelModal };
