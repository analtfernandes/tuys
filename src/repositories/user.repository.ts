import { Follows } from "@prisma/client";
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

function findFollow(data: FollowParams) {
  return prisma.follows.findFirst({ where: { ...data } });
}

function findFollowers(userId: number) {
  return prisma.follows.findMany({
    where: { followedId: userId },
    select: { Follower: { select: { username: true } } },
    orderBy: { id: "desc" },
  });
}

function createFollow(data: FollowParams) {
  return prisma.follows.create({ data: { ...data } });
}

function deleteFollow(data: FollowParams) {
  return prisma.follows.deleteMany({ where: { ...data } });
}

type FollowParams = Omit<Follows, "id">;

export {
  findUserData,
  findUsers,
  findUserDataByUserId,
  findUserById,
  findFollow,
  findFollowers,
  createFollow,
  deleteFollow,
};
