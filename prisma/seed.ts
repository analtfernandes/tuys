import { PrismaClient, Ranks } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const haveRanks = await prisma.ranks.count();

  if (haveRanks) {
    console.log({ message: "O banco já está populado!" });
    return;
  }

  const insertedRanks = await prisma.ranks.createMany({
    data: [
      {
        name: "Iniciante",
        color: "58E2FF",
      },
    ],
  });

  console.log({
    inserted: { ranksCreated: insertedRanks.count },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
