import { Sessions, Users } from "@prisma/client";
import { prisma } from "../database";

function findActiveSessionByUserId(userId: number) {
  return prisma.sessions.findFirst({
    where: {
      userId,
      active: true,
    },
  });
}

function countActiveSessionsByUserId(userId: number) {
  return prisma.sessions.count({
    where: {
      userId,
      active: true,
    },
  });
}

function findUserByEmail(email: string) {
  return prisma.users.findUnique({ where: { email }, include: { Ranks: true } });
}

function findUserByUsername(username: string) {
  return prisma.users.findUnique({ where: { username } });
}

function createUser(data: CreateUserParams) {
  return prisma.users.create({ data: { ...data }, include: { Ranks: true } });
}

function createSession(data: CreateSessionParams) {
  return prisma.sessions.create({ data: { ...data } });
}

function updateActiveSessionId(id: number) {
  return prisma.sessions.update({
    where: {
      id,
    },
    data: {
      active: false,
    },
  });
}

type CreateUserParams = Omit<Users, "id" | "about" | "status">;
type CreateSessionParams = Omit<Sessions, "id" | "active">;

export {
  findActiveSessionByUserId,
  findUserByEmail,
  findUserByUsername,
  createUser,
  createSession,
  updateActiveSessionId,
  countActiveSessionsByUserId,
};
