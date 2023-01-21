import { prisma } from "database";

async function cleanDatabase() {
  await prisma.channels.deleteMany();
  await prisma.sessions.deleteMany();
  await prisma.users.deleteMany();
  await prisma.ranks.deleteMany();
}

export { cleanDatabase };
