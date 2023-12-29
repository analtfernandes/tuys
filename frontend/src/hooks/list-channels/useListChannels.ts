import { api } from "../../services";
import { useRequestQuery, useToast } from "../index";
import { ListChannelsParams } from "./types";
import { RequestKeyEnum } from "../../components/utils/enums";

const defaultCallback = () => null;

function useListChannels({
	onError = defaultCallback,
	onSuccess = defaultCallback,
}: ListChannelsParams = {}) {
	const {
		data: channels,
		isLoading,
		isError,
		isSuccess,
	} = useRequestQuery([RequestKeyEnum.channels], getChannels);
	const toast = useToast();

	function getChannels() {
		return api.getChannels();
	}

	if (isSuccess) onSuccess();

	if (isError) {
		toast({
			type: "error",
			text: "Não foi possível carregar os canais.",
		});
		onError();
	}

	return { channels, isLoading, isError, isSuccess };
}

export { useListChannels };
