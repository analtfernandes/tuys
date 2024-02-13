import styled from "styled-components";
import { api, ChannelType } from "../../services";
import { useModal, useToast } from "../../hooks";
import { Modal } from "../shared";
import { SetState } from "../utils/Protocols";
import { Icons } from "../utils";

type CreateChannelParams = {
	setChannels: SetState<ChannelType[]>;
};

type NewChannel = {
	name: string;
	background: string;
};

export function CreateChannel({ setChannels }: CreateChannelParams) {
	const { modalConfig, handleOpenModal, handleCloseModal } = useModal({
		type: "create_channel",
	});
	const toast = useToast();

	function createChannel(data: NewChannel) {
		api
			.postChannel(data)
			.then((response) => {
				if (response) {
					setChannels((prev) => [
						...prev,
						{
							id: response.id,
							editable: true,
							...data,
						},
					]);
				}
			})
			.catch((err) =>
				toast({
					type: "error",
					text:
						err.cause?.message ||
						"Não foi possível criar o canal. Por favor, tente novamente.",
				})
			);
	}

	return (
		<>
			{modalConfig.isOpen && (
				<Modal
					type={modalConfig.type}
					callback={createChannel}
					config={{ modalConfig, handleCloseModal }}
				/>
			)}

			<Wrapper onClick={handleOpenModal}>
				<Icons type="following" size={50} title="criar canal" />
			</Wrapper>
		</>
	);
}

const Wrapper = styled.div`
	width: 126px;
	height: 190px;
	margin: 0 7px 15px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 5px;
	box-shadow: inset 130px 0 0 rgba(0, 0, 0, 0.8);
	color: #f2f2f2;
	cursor: pointer;

	:hover {
		box-shadow: inset 130px 0 0 rgba(0, 0, 0, 0.7);
	}
`;
