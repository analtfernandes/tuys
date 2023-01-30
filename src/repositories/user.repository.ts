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

function findUserDataByUserId(id: number, userId: number) {
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
      Follower: {
        where: {
          followerId: userId,
        },
      },
    },
  });
}

function findUsers(userId: number, username: string) {
  return prisma.users.findMany({
    where: { username: { contains: username } },
    select: {
      id: true,
      username: true,
      avatar: true,
      Ranks: {
        select: {
          color: true,
        },
      },
      Follower: {
        where: {
          followerId: userId,
        },
      },
    },
  });
}

function findUserById(id: number) {
  return prisma.users.findUnique({ where: { id } });
}

export { findUserData, findUsers, findUserDataByUserId, findUserById };
