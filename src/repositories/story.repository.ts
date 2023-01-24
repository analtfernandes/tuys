import { StorieStatus } from "@prisma/client";
import { prisma } from "../database";

async function findAllByChannelId({ channelId, userId }: FindAllByChannelIdParams) {
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

type FindAllByChannelIdParams = { channelId: number; userId: number };

export { findAllByChannelId };
