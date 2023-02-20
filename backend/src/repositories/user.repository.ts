import { Follows, Users } from "@prisma/client";
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

function findUserRegister(id: number) {
  return prisma.users.findUnique({
    where: { id },
    select: { id: true, username: true, avatar: true, email: true, about: true },
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
    where: { username: { contains: username, mode: "insensitive" } },
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

function findUserByUsername(username: string) {
  return prisma.users.findUnique({ where: { username } });
}

function findFollow(data: FollowParams) {
  return prisma.follows.findFirst({ where: { ...data } });
}

function findFollowers(userId: number) {
  return prisma.follows.findMany({
    where: { followedId: userId },
    select: { Followed: { select: { id: true, username: true, avatar: true, Ranks: { select: { color: true } } } } },
    orderBy: { id: "desc" },
  });
}

function createFollow(data: FollowParams) {
  return prisma.follows.create({ data: { ...data } });
}

function deleteFollow(data: FollowParams) {
  return prisma.follows.deleteMany({ where: { ...data } });
}

function updateUser(userId: number, data: UpdateUserParams) {
  return prisma.users.update({ where: { id: userId }, data: { ...data } });
}

type FollowParams = Omit<Follows, "id">;
type UpdateUserParams = Omit<Users, "id" | "email" | "password" | "rankId" | "status">;

export {
  findUserData,
  findUserRegister,
  findUsers,
  findUserDataByUserId,
  findUserById,
  findFollow,
  findFollowers,
  findUserByUsername,
  createFollow,
  deleteFollow,
  updateUser,
};
