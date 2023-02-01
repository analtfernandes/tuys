import { NotificationType } from "@prisma/client";
import { prisma } from "../database";

function findNotifications(userId: number) {
  return prisma.notifications.findMany({ where: { toUserId: userId } });
}

function findNotificationById(id: number) {
  return prisma.notifications.findUnique({ where: { id } });
}

function updateNotification(id: number) {
  return prisma.notifications.update({ where: { id }, data: { read: true } });
}

function createNewStoryNotification(text: string, userId: number) {
  return prisma.$transaction(async (p) => {
    const followers = await p.users.findMany({
      where: { Followed: { some: { followedId: userId } } },
      select: { id: true },
    });

    for (const { id } of followers) {
      await p.notifications.create({ data: { text, toUserId: id, type: NotificationType.NEW_STORY } });
    }
  });
}

function createNewDenounceNotification(text: string, userId: number) {
  return prisma.notifications.create({ data: { text, toUserId: userId, type: NotificationType.NEW_DENUNCIATION } });
}

function createNewLikeNotification(text: string, userId: number) {
  return prisma.notifications.create({ data: { text, toUserId: userId, type: NotificationType.NEW_LIKE } });
}

function createNewCommentNotification(text: string, userId: number) {
  return prisma.notifications.create({ data: { text, toUserId: userId, type: NotificationType.NEW_COMMENT } });
}

function createNewFollowNotification(text: string, userId: number) {
  return prisma.notifications.create({ data: { text, toUserId: userId, type: NotificationType.NEW_FOLLOW } });
}

export {
  findNotifications,
  findNotificationById,
  updateNotification,
  createNewStoryNotification,
  createNewDenounceNotification,
  createNewLikeNotification,
  createNewCommentNotification,
  createNewFollowNotification,
};
