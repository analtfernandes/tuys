import { useToast } from "../../../hooks";
import { DeleteChannelModal } from "./delete-channel-modal";
import { DeleteStoryModal } from "./delete-story-modal";
import { DenounceStoryModal } from "./denounce-story-modal";
import { CreateChannelModal } from "./create-channel-modal";
import { ModalParams } from "./types";

function Modal({
	type,
	data,
	config,
	defaultForm,
	callback,
}: Readonly<ModalParams>) {
	const toast = useToast();

	if (type === "delete_channel" && !data?.name) return handleDataError();
	if (type === "delete_story" && !data?.name) return handleDataError();

	function handleDataError() {
		toast({
			type: "error",
			text: "As informações necessárias para o Modal não foram fornecidas!",
		});

		return <></>;
	}

	return (
		<>
			{type === "denounce_story" && (
				<DenounceStoryModal config={config} callback={callback} />
			)}

			{type === "delete_story" && (
				<DeleteStoryModal story={data!} config={config} callback={callback} />
			)}

			{type === "delete_channel" && (
				<DeleteChannelModal
					channel={data!}
					config={config}
					callback={callback}
				/>
			)}

			{type === "create_channel" && (
				<CreateChannelModal
					config={config}
					callback={callback}
					defaultForm={defaultForm}
				/>
			)}
		</>
	);
}

export { Modal };
