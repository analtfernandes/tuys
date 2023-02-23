import { Channels, Follows, NotificationType, Stories, Users } from "@prisma/client";
import { prisma } from "../database";

function findNotifications(userId: number) {
  return prisma.notifications.findMany({
    where: { toUserId: userId },
    orderBy: [{ date: "desc" }, { read: "asc" }, { id: "desc" }],
  });
}

function findNotificationById(id: number) {
  return prisma.notifications.findUnique({ where: { id } });
}

function updateNotification(id: number) {
  return prisma.notifications.update({ where: { id }, data: { read: true } });
}

function createNewStoryNotification({ story, channel }: CreateNewStoryNotificationParams) {
  return prisma.$transaction(async (p) => {
    const followers = await p.users.findMany({
      where: { Followed: { some: { followedId: story.userId } } },
      select: { id: true },
    });

    const text = `
    #${story.Users.username}# acabou de escrever 
    #${story.title}# no canal #${channel.name}#.`;

    for (const { id } of followers) {
      await p.notifications.create({ data: { text, toUserId: id, type: NotificationType.NEW_STORY } });
    }
  });
}

function createNewDenounceNotification(story: Stories, reason: string) {
  return prisma.notifications.create({
    data: {
      text: `Sua história: #${story.title}# foi denunciada, pois: #“${reason}”#.`,
      toUserId: story.userId,
      type: NotificationType.NEW_DENUNCIATION,
    },
  });
}

function createNewLikeNotification(story: Stories, userId: number) {
  return prisma.$transaction(async (p) => {
    const likedByUser = await p.users.findUnique({ where: { id: userId } });
    const likesCount = await p.likes.count({ where: { AND: [{ storyId: story.id, NOT: { userId: story.userId } }] } });

    if (likesCount === 1) {
      const text = `#${likedByUser?.username}# gostou da sua história: #${story.title}#.`;
      await p.notifications.create({ data: { text, toUserId: story.userId, type: NotificationType.NEW_LIKE } });
    }

    if (likesCount > 1) {
      const notification = await p.notifications.findFirst({
        where: { type: NotificationType.NEW_LIKE, toUserId: story.userId, text: { contains: `#${story.title}#.` } },
      });

      const text = `#${likedByUser?.username}# e mais ${likesCount - 1} pessoa(s) gostaram da sua história: #${
        story.title
      }#.`;

      if (notification) {
        await p.notifications.update({
          where: { id: notification.id },
          data: { text, date: new Date(), read: false },
        });
      } else {
        await p.notifications.create({ data: { text, toUserId: story.userId, type: NotificationType.NEW_LIKE } });
      }
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

    if (commentsCount > 1) {
      const notification = await p.notifications.findFirst({
        where: { type: NotificationType.NEW_COMMENT, toUserId: story.userId, text: { contains: `#${story.title}#.` } },
      });

      const text = `#${commentedByUser?.username}# e outros adicionaram ${commentsCount} comentários na sua história: #${story.title}#.`;

      if (notification) {
        await p.notifications.update({
          where: { id: notification.id },
          data: { text, date: new Date(), read: false },
        });
      } else {
        await p.notifications.create({ data: { text, toUserId: story.userId, type: NotificationType.NEW_COMMENT } });
      }
    }
  });
}

function createNewFollowNotification({ followedId, followerId }: CreateNewFollowNotificationParams) {
  return prisma.$transaction(async (p) => {
    const followedByUser = await p.users.findUnique({ where: { id: followerId } });

    if (!followedByUser) throw new Error("Follower não existe!");

    await p.notifications.create({
      data: {
        text: `#${followedByUser.username}# começou a te seguir.`,
        toUserId: followedId,
        type: NotificationType.NEW_FOLLOW,
      },
    });
  });
}

function createNewBanNotification(toUserId: number) {
  return prisma.notifications.create({
    data: {
      text: `Você foi #banido# porque excedeu o limite de histórias banidas.`,
      toUserId: toUserId,
      type: NotificationType.NEW_BAN,
    },
  });
}

function createNewUnbanNotification(toUserId: number, byUser: Users) {
  return prisma.notifications.create({
    data: {
      text: `Você foi #desbanido# por #${byUser.username}#.`,
      toUserId: toUserId,
      type: NotificationType.NEW_UNBAN,
    },
  });
}

type CreateNewStoryNotificationParams = {
  story: Stories & {
    Users: {
      username: string;
    };
  };
  channel: Channels;
};
type CreateNewFollowNotificationParams = Omit<Follows, "id">;

export {
  findNotifications,
  findNotificationById,
  updateNotification,
  createNewStoryNotification,
  createNewDenounceNotification,
  createNewLikeNotification,
  createNewCommentNotification,
  createNewFollowNotification,
  createNewBanNotification,
  createNewUnbanNotification,
};
