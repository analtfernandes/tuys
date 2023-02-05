import { prisma } from "../../src/database";

async function cleanDatabase() {
  await prisma.likes.deleteMany();
  await prisma.comments.deleteMany();
  await prisma.denunciations.deleteMany();
  await prisma.stories.deleteMany();
  await prisma.channels.deleteMany();
  await prisma.sessions.deleteMany();
  await prisma.follows.deleteMany();
  await prisma.notifications.deleteMany();
  await prisma.users.deleteMany();
  await prisma.ranks.deleteMany();
}

export { cleanDatabase };
