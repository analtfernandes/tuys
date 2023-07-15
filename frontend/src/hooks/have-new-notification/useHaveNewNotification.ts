import { useState } from "react";
import { useUserContext } from "../../contexts";
import api from "../../services/tuys";
import { RequestKeyEnum } from "../../components/utils/enums";
import { useRequestQuery } from "../index";

function useHaveNewNotification() {
	const [haveNewNotification, setHaveNewNotification] = useState(false);
	const { user } = useUserContext();
	const { data: notifications } = useRequestQuery(
		[RequestKeyEnum.notifications, user.username],
		getNotifications
	);

	function getNotifications() {
		if (haveNewNotification) {
			return Promise.resolve(null);
		}

		return api.getNotifications();
	}

	function haveUnreadNotification() {
		return (
			notifications &&
			notifications.length > 0 &&
			!notifications[0]?.read &&
			!haveNewNotification
		);
	}

	function haveAlreadyReadNotification() {
		return (
			notifications &&
			((notifications[0]?.read && haveNewNotification) ||
				(notifications.length === 0 && haveNewNotification))
		);
	}

	if (haveUnreadNotification()) {
		setHaveNewNotification(true);
	}

	if (haveAlreadyReadNotification()) {
		setHaveNewNotification(false);
	}

	return [haveNewNotification];
}

export { useHaveNewNotification };
