import * as notificationRepository from "../repositories/notification.repository";
import { badRequestError, notFoundError, unauthorizedError } from "../helpers/errors.helper";

async function getNotifications(userId: number) {
  return notificationRepository.findNotifications(userId);
}

async function postNotificationRead(userId: number, notificationId: number) {
  const notification = await notificationRepository.findNotificationById(notificationId);

  if (!notification) throw notFoundError();
  if (notification.toUserId !== userId) throw unauthorizedError();
  if (notification.read) throw badRequestError();

  await notificationRepository.updateNotification(notificationId);
}

export { getNotifications, postNotificationRead };
