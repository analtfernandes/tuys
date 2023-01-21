import { prisma } from "../database";

function findAll() {
  return prisma.channels.findMany();
}

export { findAll };
