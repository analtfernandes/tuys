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

function findUserByEmail(email: string) {
  return prisma.users.findUnique({ where: { email }, include: { Ranks: { select: { color: true } } } });
}

function findUserByUsername(username: string) {
  return prisma.users.findUnique({ where: { username } });
}

function createUser(data: CreateUserParams) {
  return prisma.users.create({ data: { ...data } });
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
};
