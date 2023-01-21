import { prisma } from "../database";

function findAll() {
  return prisma.channels.findMany({ orderBy: { id: "asc" } });
}

export { findAll };
