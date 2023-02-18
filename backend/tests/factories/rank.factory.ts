import { faker } from "@faker-js/faker";
import { RanksHelper } from "helpers/ranks.helper";
import { prisma } from "../../src/database";

function createRank() {
  return prisma.ranks.create({
    data: {
      name: faker.internet.userName(),
      color: faker.internet.color(),
    },
  });
}

async function createAppRanks() {
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

  return prisma.ranks.findMany({
    where: {
      name: {
        in: [
          RanksHelper.LEVEL_1.name,
          RanksHelper.LEVEL_2.name,
          RanksHelper.LEVEL_3.name,
          RanksHelper.LEVEL_4.name,
          RanksHelper.LEVEL_5.name,
          RanksHelper.LEVEL_6.name,
          RanksHelper.LEVEL_7.name,
        ],
      },
    },
    orderBy: {
      id: "asc",
    },
  });
}

export { createRank, createAppRanks };
