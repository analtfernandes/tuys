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

function updateUserRank(userId: number) {
  return prisma.$transaction(async (p) => {
    const user = await p.users.findUnique({
      where: { id: userId },
      select: {
        Ranks: { select: { name: true } },
        Stories: { select: { id: true } },
      },
    });
    if (!user) throw new Error();

    const ranks = await p.ranks.findMany({ orderBy: { id: "asc" } });
    let userLevel = 0;

    if (user.Ranks.name === RanksHelper.LEVEL_1.name) userLevel = 1;
    if (user.Ranks.name === RanksHelper.LEVEL_2.name) userLevel = 2;
    if (user.Ranks.name === RanksHelper.LEVEL_3.name) userLevel = 3;
    if (user.Ranks.name === RanksHelper.LEVEL_4.name) userLevel = 4;
    if (user.Ranks.name === RanksHelper.LEVEL_5.name) userLevel = 5;
    if (user.Ranks.name === RanksHelper.LEVEL_6.name) userLevel = 6;
    if (user.Ranks.name === RanksHelper.LEVEL_7.name) userLevel = 7;
    if (userLevel === 0) throw new Error();

    if (userLevel !== 7) {
      const storiesCount = user.Stories.length;
      const likesCount = await p.likes.count({ where: { storyId: { in: user.Stories.map(({ id }) => id) } } });
      const likesPerStory = likesCount / storiesCount;

      switch (userLevel) {
        case 1:
          if (storiesCount > 10) {
            await p.users.update({ where: { id: userId }, data: { rankId: ranks[1].id } });
          }
          break;
        case 2:
          if (likesPerStory > 50) {
            await p.users.update({ where: { id: userId }, data: { rankId: ranks[2].id } });
          }
          break;
        case 3:
          if (likesPerStory > 200) {
            await p.users.update({ where: { id: userId }, data: { rankId: ranks[3].id } });
          }
          break;
        case 4:
          if (likesPerStory > 500) {
            await p.users.update({ where: { id: userId }, data: { rankId: ranks[4].id } });
          }
          break;
        case 5:
          if (likesPerStory > 2000) {
            await p.users.update({ where: { id: userId }, data: { rankId: ranks[5].id } });
          }
          break;
        case 6:
          if (likesPerStory > 10000) {
            await p.users.update({ where: { id: userId }, data: { rankId: ranks[6].id } });
          }
          break;

        default:
          break;
      }
    }
  });
}

export { findRankByName, createRanks, updateUserRank };
