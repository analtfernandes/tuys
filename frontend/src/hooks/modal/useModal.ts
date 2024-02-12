import { useReducer } from "react";
import {
	ModalConfigType,
	ModalType,
	ReducerActionType,
	ModalReducerType,
} from "./types";

function reducer(config: ModalConfigType, action: ReducerActionType) {
	const { type, value } = action;

	if (type === "state" && typeof value === "boolean") return { ...config, isOpen: value };
	if (type === "type" && typeof value === "string") return { ...config, type: value };

	return config;
}

function useModal(defaultConfig = {}) {
	const [modalConfig, dispatch] = useReducer<ModalReducerType>(reducer, {
		isOpen: false,
		type: "create_channel",
		...defaultConfig,
	});

	function setType(value: ModalType) {
		dispatch({ type: "type", value });
	}

	function setCreateChannelType() {
		setType("create_channel");
	}

	function setDeleteChannelType() {
		setType("delete_channel");
	}

	function setDeleteStoryType() {
		setType("delete_story");
	}

	function setDenounceStoryType() {
		setType("denounce_story");
	}

	function handleOpenModal() {
		dispatch({ type: "state", value: true });
	}

	function handleCloseModal() {
		dispatch({ type: "state", value: false });
	}

	return {
		modalConfig,
		setCreateChannelType,
		setDeleteChannelType,
		setDeleteStoryType,
		setDenounceStoryType,
		handleCloseModal,
		handleOpenModal,
	};
}

export { useModal };
