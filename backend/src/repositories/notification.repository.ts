import { NotificationType, Stories } from "@prisma/client";
import { prisma } from "../database";

function findNotifications(userId: number) {
  return prisma.notifications.findMany({ where: { toUserId: userId }, orderBy: { id: "desc" } });
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

function createNewLikeNotification(story: Stories, userId: number) {
  return prisma.$transaction(async (p) => {
    const likedByUser = await p.users.findUnique({ where: { id: userId } });
    const likesCount = await p.likes.count({ where: { AND: [{ storyId: story.id, NOT: { userId: story.userId } }] } });

    if (likesCount === 1) {
      const text = `#${likedByUser?.username}# gostou da sua história: #${story.title}#.`;
      await p.notifications.create({ data: { text, toUserId: story.userId, type: NotificationType.NEW_LIKE } });
    }

    if (likesCount % 4 === 0) {
      const text = `#${likedByUser?.username}# e mais 3 gostaram da sua história: #${story.title}#.`;
      await p.notifications.create({ data: { text, toUserId: story.userId, type: NotificationType.NEW_LIKE } });
    }
  });
}

function createNewCommentNotification(story: Stories, userId: number) {
  return prisma.$transaction(async (p) => {
    const commentedByUser = await p.users.findUnique({ where: { id: userId } });
    const commentsCount = await p.comments.count({
      where: { AND: [{ storyId: story.id, NOT: { userId: story.userId } }] },
    });

    if (commentsCount === 1) {
      const text = `#${commentedByUser?.username}# comentou sua história: #${story.title}#.`;
      await p.notifications.create({ data: { text, toUserId: story.userId, type: NotificationType.NEW_COMMENT } });
    }

    if (commentsCount % 4 === 0) {
      const text = `#${commentedByUser?.username}# e mais 3 comentaram sua história: #${story.title}#.`;
      await p.notifications.create({ data: { text, toUserId: story.userId, type: NotificationType.NEW_COMMENT } });
    }
  });
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
