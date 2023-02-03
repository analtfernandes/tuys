import { Users } from "@prisma/client";
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
  return prisma.users.findUnique({ where: { email } });
}

function findUserByUsername(username: string) {
  return prisma.users.findUnique({ where: { username } });
}

function createUser(data: CreateUserParams) {
  return prisma.users.create({ data: { ...data } });
}

type CreateUserParams = Omit<Users, "id" | "about" | "status">;

export { findActiveSessionByUserId, findUserByEmail, findUserByUsername, createUser };
