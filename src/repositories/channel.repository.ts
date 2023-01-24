import { prisma } from "../database";

function findAll() {
  return prisma.channels.findMany({ orderBy: { id: "asc" } });
}

function findById(id: number) {
  return prisma.channels.findUnique({ where: { id } });
}

export { findAll, findById };
