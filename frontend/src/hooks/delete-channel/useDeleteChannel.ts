import { api } from "../../services";
import { RequestKeyEnum } from "../../components/utils/enums";
import { useRequestMutation, useToast } from "../index";
import { DeleteChannelParams } from "./types";

const defaultCallback = () => null;

function useDeleteChannel({
	onError = defaultCallback,
	onSuccess = defaultCallback,
}: DeleteChannelParams = {}) {
	const toast = useToast();
	const { isError, isSuccess, isLoading, ...request } = useRequestMutation(
		[RequestKeyEnum.channels],
		(id) => api.deleteChannel(id)
	);

	function handleDeleteChannel(id: number) {
		request.mutate(id);
	}

	function resetRequest() {
		request.reset();
	}

	if (isSuccess) {
		onSuccess();
		resetRequest();
	}

	if (isError) {
		toast({
			type: "error",
			text:
				request.error ||
				"Não foi possível apagar o canal. Por favor, tente novamente.",
		});
		onError();
		resetRequest();
	}

	return { handleDeleteChannel, isError, isSuccess, isLoading };
}

export { useDeleteChannel };
