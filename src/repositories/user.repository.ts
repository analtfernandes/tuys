import { prisma } from "../database";

function findUserData(id: number) {
  return prisma.users.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      avatar: true,
      about: true,
      status: true,
      Ranks: { select: { color: true, name: true } },
      _count: {
        select: {
          Followed: true,
          Follower: true,
          Stories: true,
        },
      },
      Stories: {
        where: {
          status: "BANNED",
        },
      },
    },
  });
}

export { findUserData };
