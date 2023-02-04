import { Sessions } from "@prisma/client";
import { prisma } from "../../src/database";

function createSession(data: CreateSessionParams) {
  return prisma.sessions.create({
    data,
  });
}

function updateActiveSession(id: number) {
  return prisma.sessions.update({
    where: {
      id,
    },
    data: {
      active: false,
    },
  });
}

type CreateSessionParams = Omit<Sessions, "id" | "active">;

export { createSession, updateActiveSession };
