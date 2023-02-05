import { faker } from "@faker-js/faker";
import { Notifications, NotificationType } from "@prisma/client";
import { prisma } from "../../src/database";

function createNotification(userId: number, data?: CreateNotificationParams) {
  return prisma.notifications.create({
    data: {
      text: faker.animal.snake(),
      toUserId: userId,
      type: NotificationType.NEW_LIKE,
      ...data,
    },
  });
}

type CreateNotificationParams = Partial<Notifications>;

export { createNotification };
