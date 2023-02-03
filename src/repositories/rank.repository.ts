import { prisma } from "../database";
import { RanksHelper } from "../helpers/ranks.helper";

function findRankByName(name: string) {
  return prisma.ranks.findUnique({ where: { name } });
}

async function createRanks() {
  await prisma.ranks.createMany({
    data: [
      RanksHelper.LEVEL_1,
      RanksHelper.LEVEL_2,
      RanksHelper.LEVEL_3,
      RanksHelper.LEVEL_4,
      RanksHelper.LEVEL_5,
      RanksHelper.LEVEL_6,
      RanksHelper.LEVEL_7,
    ],
    skipDuplicates: true,
  });

  return prisma.ranks.findUnique({ where: { name: RanksHelper.LEVEL_1.name } });
}

export { findRankByName, createRanks };
