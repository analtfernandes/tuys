import { useState } from "react";
import { useUserContext } from "../contexts/user/UserContext";
import api from "../services/tuys";
import { RequestKeyEnum } from "../components/utils/enums";
import { useRequestQuery } from "./useRequest";

export function useHaveNewNotification() {
	const [haveNewNotification, setHaveNewNotification] = useState(false);
	const { user } = useUserContext();
	const { data: notifications } = useRequestQuery(
		[RequestKeyEnum.notifications, user.username],
		() => getNotifications()
	);

	function getNotifications() {
		if (haveNewNotification) {
			return new Promise<null>((resolve) => resolve(null));
		}

		return api.getNotifications();
	}

	if (
		notifications &&
		notifications.length > 0 &&
		!notifications[0]?.read &&
		!haveNewNotification
	) {
		setHaveNewNotification(true);
	}

	if (
		notifications &&
		((notifications[0]?.read && haveNewNotification) ||
			(notifications?.length === 0 && haveNewNotification))
	) {
		setHaveNewNotification(false);
	}

	return [haveNewNotification];
}
