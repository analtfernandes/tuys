import * as notificationRepository from "../repositories/notification.repository";

async function getNotifications(userId: number) {
  return notificationRepository.findNotifications(userId);
}

export { getNotifications };
