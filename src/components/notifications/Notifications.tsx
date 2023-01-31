import styled from "styled-components";
import { useUserContext } from "../../contexts/UserContext";
import api from "../../services/tuys";
import { NotificationTypesEnum, RequestKeyEnum } from "../utils/enums";
import { useToast, useRequestQuery } from "../hooks";
import { Subtitle, Title } from "../shared";
import { Icons } from "../utils";

type NotificationProps = {
	read: boolean;
};

type NotificationIconsType = {
	[key: string]: "comment" | "denounce" | "follower" | "unlike" | "edit";
};

export function Notifications() {
	const { user } = useUserContext();
	const toast = useToast();
	const {
		isError,
		data: notifications,
		...request
	} = useRequestQuery([RequestKeyEnum.notifications, user.username], () =>
		api.getNotifications()
	);

	const notificationIconsType: NotificationIconsType = {
		[NotificationTypesEnum.NEW_COMMENT]: "comment",
		[NotificationTypesEnum.NEW_DENUNCIATION]: "denounce",
		[NotificationTypesEnum.NEW_LIKE]: "follower",
		[NotificationTypesEnum.NEW_LIKE]: "unlike",
		[NotificationTypesEnum.NEW_STORY]: "edit",
	};

	if (isError) {
		toast({
			type: "error",
			text:
				request.error ||
				"Não foi possível carregar os canais. Por favor, recarregue a página.",
		});
		return null;
	}

	if (typeof notifications !== "object") {
		return <></>;
	}

	return (
		<Wrapper>
			<Title>Notificações</Title>

			{notifications.length === 0 && (
				<Subtitle>Não há nenhuma notificação ainda.</Subtitle>
			)}

			{notifications.length > 0 && (
				<div>
					{notifications.map((notification, index) => (
						<Notification key={index} read={notification.read}>
							<div>
								<Icons type={notificationIconsType[notification.type]} />
								<span>{notification.text}</span>
							</div>
							<span>
								{new Date(notification.date).toLocaleDateString("pt-br")}
							</span>
						</Notification>
					))}
				</div>
			)}
		</Wrapper>
	);
}

const Wrapper = styled.section`
	width: 100%;
	height: 100%;
	padding: 0 15px;
	margin: 0 auto;

	@media (min-width: 600px) {
		width: 90%;
		padding: 0;
	}

	@media (min-width: 1000px) {
		width: 70%;
		padding: 0;
	}
`;

const Notification = styled.div<NotificationProps>`
	width: 100%;
	min-height: 80px;
	height: auto;
	padding: 20px;
	display: flex;
	flex-direction: column;
	background-color: ${(props) =>
		props.read ? props.theme.colors.lightGray : props.theme.colors.pastelPink};
	border-top: 1px solid ${(props) => props.theme.colors.black};
	border-bottom: 1px solid ${(props) => props.theme.colors.black};
	cursor: default;

	:hover {
		filter: brightness(0.9);
	}

	> div {
		display: flex;
		align-items: center;

		span {
			font-size: 1.1rem;
			color: ${(props) => props.theme.colors.darkGray};
			margin-left: 10px;
		}

		svg {
			font-size: 1.5rem;
			color: ${(props) => props.theme.colors.darkGray};
		}
	}

	> span {
		margin-top: 10px;
		align-self: end;
		font-size: 0.85rem;
		color: ${(props) => props.theme.colors.mediumGraySecond};
	}

	@media (max-width: 500px) {
		> div {
			span {
				font-size: 1rem;
			}
		}
	}
`;
