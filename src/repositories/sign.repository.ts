import { prisma } from "../database";

function findActiveSessionByUserId(userId: number) {
  return prisma.sessions.findFirst({
    where: {
      userId,
      active: true,
    },
  });
}

export { findActiveSessionByUserId };
