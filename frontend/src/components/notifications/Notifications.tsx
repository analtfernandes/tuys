import styled from "styled-components";
import { useEffect, useState } from "react";
import api from "../../services/tuys";
import { useToast } from "../../hooks";
import { NotificationTypesEnum } from "../utils/enums";
import { NotificationType } from "../utils/Protocols";
import { Icons } from "../utils";
import { Loading, Subtitle, Title } from "../shared";

type NotificationProps = {
	read: boolean;
};

type NotificationIconsType = {
	[key: string]: "comment" | "denounce" | "follower" | "unlike" | "edit";
};

export function Notifications() {
	const [notifications, setNotifications] = useState<NotificationType[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const toast = useToast();

	const notificationIconsType: NotificationIconsType = {
		[NotificationTypesEnum.NEW_COMMENT]: "comment",
		[NotificationTypesEnum.NEW_DENUNCIATION]: "denounce",
		[NotificationTypesEnum.NEW_FOLLOW]: "follower",
		[NotificationTypesEnum.NEW_LIKE]: "unlike",
		[NotificationTypesEnum.NEW_STORY]: "edit",
	};

	useEffect(() => {
		api
			.getNotifications()
			.then((notifications) => {
				if (notifications) {
					setIsLoading(false);
					setNotifications(notifications);
				}
			})
			.catch((error) =>
				toast({
					type: "error",
					text:
						error.message ||
						"Não foi possível carregar as notificações. Por favor, recarregue a página.",
				})
			);
	}, []);

	useEffect(() => {
		(async () => {
			const notificationsIds = notifications
				.filter(({ read }) => read === false)
				.map(({ id }) => id);

			for (const id of notificationsIds) {
				await api.postNotificationRead(id);
			}
		})();
	}, [notifications]);

	function getNotificationHtmlMessage(text: string) {
		return text
			.split(" ")
			.map((word) => word.replace(/^#/, "<b>").replace("#", "</b>"))
			.join(" ");
	}

	return (
		<Wrapper>
			<Title>Notificações</Title>

			{isLoading && <Loading />}

			{!isLoading && notifications.length === 0 && (
				<Subtitle>Não há nenhuma notificação ainda.</Subtitle>
			)}

			{notifications.length > 0 && (
				<div>
					{notifications.map((notification, index) => (
						<Notification key={index} read={notification.read}>
							<div>
								<Icons type={notificationIconsType[notification.type]} />
								<span
									dangerouslySetInnerHTML={{
										__html: getNotificationHtmlMessage(notification.text),
									}}
								/>
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

		b {
			font-weight: 700;
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
