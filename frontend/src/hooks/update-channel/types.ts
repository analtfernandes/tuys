import { CallbackType } from "../../components/utils/Protocols";

type UpdateChannelParams = { onError?: CallbackType; onSuccess?: CallbackType };

type HandleUpdateChannelDataType = {
	name: string;
	background: string;
};

export type { UpdateChannelParams, HandleUpdateChannelDataType };
