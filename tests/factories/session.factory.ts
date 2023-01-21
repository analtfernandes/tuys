import { Sessions } from "@prisma/client";
import { prisma } from "database";

function createSession(data: CreateSessionParams) {
  return prisma.sessions.create({
    data,
  });
}

type CreateSessionParams = Omit<Sessions, "id" | "active">;

export { createSession };
