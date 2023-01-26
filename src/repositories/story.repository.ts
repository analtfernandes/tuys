import { Comments, Denunciations, Stories, StorieStatus, UserStatus } from "@prisma/client";
import { prisma } from "../database";

function findAllByChannelId({ channelId, userId }: FindAllByChannelIdParams) {
  return prisma.stories.findMany({
    where: { channelId, status: StorieStatus.ACTIVE },
    select: {
      id: true,
      title: true,
      body: true,
      userId: true,
      date: true,
      Users: {
        select: {
          id: true,
          username: true,
          avatar: true,
          status: true,
          Ranks: { select: { color: true } },
          Follower: {
            where: {
              followerId: userId,
            },
          },
        },
      },
      _count: {
        select: {
          Comments: true,
          Likes: true,
        },
      },
      Likes: {
        where: { userId },
      },
      Channels: {
        select: {
          name: true,
        },
      },
    },

    orderBy: { id: "desc" },
  });
}

function findAllAfterId({ channelId, userId, storyId }: FindAllAfterIdIdParams) {
  return prisma.stories.findMany({
    where: { channelId, status: StorieStatus.ACTIVE, id: { gt: storyId } },
    select: {
      id: true,
      title: true,
      body: true,
      userId: true,
      date: true,
      Users: {
        select: {
          id: true,
          username: true,
          avatar: true,
          status: true,
          Ranks: { select: { color: true } },
          Follower: {
            where: {
              followerId: userId,
            },
          },
        },
      },
      _count: {
        select: {
          Comments: true,
          Likes: true,
        },
      },
      Likes: {
        where: { userId },
      },
      Channels: {
        select: {
          name: true,
        },
      },
    },

    orderBy: { id: "desc" },
  });
}

function findById(id: number) {
  return prisma.stories.findUnique({ where: { id } });
}

function findStoryLikedByUser(storyId: number, userId: number) {
  return prisma.likes.findFirst({ where: { storyId, userId } });
}

function findComments(storyId: number, userId: number) {
  return prisma.comments.findMany({
    where: { storyId },
    include: {
      Users: {
        select: {
          id: true,
          username: true,
          avatar: true,
          status: true,
          Ranks: { select: { color: true } },
          Follower: {
            where: {
              followerId: userId,
            },
          },
        },
      },
      Stories: {
        select: {
          userId: true,
        },
      },
    },
  });
}

function createStory(data: CreateStoryParams) {
  return prisma.stories.create({ data: { ...data } });
}

function createLike(storyId: number, userId: number) {
  return prisma.likes.create({ data: { storyId, userId } });
}

function createComment(data: CreateCommentParams) {
  return prisma.comments.create({ data: { ...data } });
}

function createDenunciation(data: PostDenounceParams) {
  return prisma.$transaction(async (pr) => {
    await pr.denunciations.create({ data: { ...data } });

    const storieDenuncies = await pr.denunciations.count({ where: { storyId: data.storyId } });

    if (storieDenuncies >= 3) {
      await pr.stories.update({ where: { id: data.storyId }, data: { status: StorieStatus.BANNED } });
    }

    const storyFromUser = await pr.stories.findFirst({ where: { id: data.storyId } });

    if (!storyFromUser) throw new Error();

    const bannedStoriesFromUser = await pr.stories.count({
      where: { userId: storyFromUser.userId, status: StorieStatus.BANNED },
    });

    if (bannedStoriesFromUser >= 4) {
      await pr.users.update({ where: { id: storyFromUser.userId }, data: { status: UserStatus.BANNED } });
    }
  });
}

function deleteLike(id: number) {
  return prisma.likes.delete({ where: { id } });
}

type FindAllByChannelIdParams = { channelId: number; userId: number };
type FindAllAfterIdIdParams = FindAllByChannelIdParams & { storyId: number };
type CreateStoryParams = Omit<Stories, "id" | "data" | "status">;
type CreateCommentParams = Omit<Comments, "id">;
type PostDenounceParams = Omit<Denunciations, "id">;

export {
  findAllByChannelId,
  findComments,
  findAllAfterId,
  findById,
  findStoryLikedByUser,
  createStory,
  createLike,
  createComment,
  createDenunciation,
  deleteLike,
};
