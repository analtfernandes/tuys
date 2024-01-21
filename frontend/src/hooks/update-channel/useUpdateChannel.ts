import { api } from "../../services";
import { RequestKeyEnum } from "../../components/utils/enums";
import { useRequestMutation, useToast } from "../index";
import { HandleUpdateChannelDataType, UpdateChannelParams } from "./types";

const defaultCallback = () => null;

function useUpdateChannel({
	onError = defaultCallback,
	onSuccess = defaultCallback,
}: UpdateChannelParams = {}) {
	const toast = useToast();
	const { isError, isSuccess, isLoading, ...request } = useRequestMutation(
		[RequestKeyEnum.channels],
		({ data, id }) => api.putChannel(data, id)
	);

	function handleUpdateChannel(data: HandleUpdateChannelDataType, id: number) {
		request.mutate({ data, id });
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
				"Não foi possível editar o canal. Por favor, tente novamente.",
		});
		onError();
		resetRequest();
	}

	return { handleUpdateChannel, isError, isSuccess, isLoading };
}

export { useUpdateChannel };
