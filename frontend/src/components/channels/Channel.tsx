import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { api, ChannelType } from "../../services";
import { useToast } from "../../hooks";
import {  SetState } from "../utils/Protocols";
import { Icons } from "../utils";
import { Modal, ModalSetStateType } from "../shared";

type ChannelParams = {
	channel: ChannelType;
	setChannels: SetState<ChannelType[]>;
};

type WrapperProps = {
	background: string;
};

type EditChannel = {
	name: string;
	background: string;
};

export function Channel({ channel, setChannels }: ChannelParams) {
	const [modalConfig, setModalConfig] = useState({
		isOpen: false,
		type: "createChannel",
	} as ModalSetStateType);
	const navigate = useNavigate();
	const toast = useToast();

	const { id, name, background, editable } = channel;

	function goToChannel() {
		const route = name
			.replaceAll("/", "-")
			.replaceAll("?", "-")
			.toLocaleLowerCase();
		navigate(`/channels/${route}`, {
			state: { channelId: id, channelName: name },
		});
	}

	function callModal(
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
		type: "edit" | "delete"
	) {
		event.stopPropagation();

		if (type === "edit") {
			setModalConfig({ type: "createChannel", isOpen: true });
			return;
		}

		setModalConfig({ type: "deleteChannel", isOpen: true });
	}

	function updateChannelCallback(data: EditChannel) {
		api
			.putChannel(data, id)
			.then(() => {
				setChannels((prev) => {
					const clonedChannels = [...prev];
					clonedChannels.forEach((channel) => {
						if (channel.id === id) {
							channel.name = data.name;
							channel.background = data.background;
						}
					});
					return clonedChannels;
				});
			})
			.catch((err) =>
				toast({
					type: "error",
					text:
						err.cause?.message ||
						"Não foi possível editar o canal. Por favor, tente novamente.",
				})
			);
	}

	function deleteChannelCallback() {
		api
			.deleteChannel(id)
			.then(() => {
				setChannels((prev) => prev.filter((channel) => channel.id !== id));
			})
			.catch((err) =>
				toast({
					type: "error",
					text:
						err.cause?.message ||
						"Não foi possível apagar o canal. Por favor, tente novamente.",
				})
			);
	}

	return (
		<>
			{modalConfig.isOpen && (
				<Modal
					type={modalConfig.type}
					modalIsOpen={modalConfig.isOpen}
					setModalIsOpen={setModalConfig}
					callback={
						modalConfig.type === "createChannel"
							? updateChannelCallback
							: deleteChannelCallback
					}
					defaultForm={{ name, background }}
					channelData={{ name }}
				/>
			)}

			<Wrapper background={background} onClick={goToChannel}>
				<img src={background} alt={name} />
				<span>{name}</span>

				{editable && (
					<div>
						<button onClick={(e) => callModal(e, "edit")}>
							<Icons type="edit" size={20} title="editar" />
						</button>
						<button onClick={(e) => callModal(e, "delete")}>
							<Icons type="delete" size={20} title="apagar" />
						</button>
					</div>
				)}
			</Wrapper>
		</>
	);
}

const Wrapper = styled.div<WrapperProps>`
	width: 126px;
	height: 190px;
	padding: 10px;
	margin: 0 7px 15px;
	display: flex;
	align-items: center;
	position: relative;
	border-radius: 5px;
	box-shadow: inset 130px 0 0 rgba(0, 0, 0, 0.5);
	word-break: break-word;
	text-align: center;
	cursor: pointer;

	:hover {
		box-shadow: inset 130px 0 0 rgba(0, 0, 0, 0.7);
	}

	span {
		font-size: 20px;
		font-weight: 700;
		color: #f2f2f2;
	}

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 5px;
		position: absolute;
		top: 0;
		left: 0;
		z-index: -1;
	}

	div {
		position: absolute;
		top: 0.5rem;
		right: 0.3rem;

		button {
			background-color: transparent;
			border: none;
			cursor: pointer;
		}

		svg {
			color: #f2f2f2;
		}
	}
`;
