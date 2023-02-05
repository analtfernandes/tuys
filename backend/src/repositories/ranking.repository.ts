import { StorieStatus } from "@prisma/client";
import { prisma } from "../database";

function findStories({ from, userId }: FindStoriesParams) {
  return prisma.stories.findMany({
    where: { AND: [{ Likes: { some: { date: { gte: from, lte: new Date() } } } }, { status: StorieStatus.ACTIVE }] },
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
    orderBy: { Likes: { _count: "desc" } },
    take: 20,
  });
}

type FindStoriesParams = {
  from: string;
  userId: number;
};

export { findStories };
