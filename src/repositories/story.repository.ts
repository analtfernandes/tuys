import { Stories, StorieStatus } from "@prisma/client";
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

function deleteLike(id: number) {
  return prisma.likes.delete({ where: { id } });
}

type FindAllByChannelIdParams = { channelId: number; userId: number };
type FindAllAfterIdIdParams = FindAllByChannelIdParams & { storyId: number };
type CreateStoryParams = Omit<Stories, "id" | "data" | "status">;

export {
  findAllByChannelId,
  findComments,
  findAllAfterId,
  findById,
  findStoryLikedByUser,
  createStory,
  createLike,
  deleteLike,
};
