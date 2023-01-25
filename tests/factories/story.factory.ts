import { faker } from "@faker-js/faker";
import { prisma } from "../../src/database";

function createStory(userId: number) {
  return prisma.channels.create({
    data: {
      name: faker.lorem.word({ length: { min: 3, max: 30 } }),
      background: faker.image.abstract(),
      Stories: {
        create: {
          title: faker.lorem.word(10),
          body: faker.lorem.paragraph(),
          userId,
        },
      },
    },
    include: {
      Stories: {
        include: { Users: true },
      },
    },
  });
}

function createStoryOfChannel(userId: number, channelId: number) {
  return prisma.stories.create({
    data: {
      title: faker.lorem.word(10),
      body: faker.lorem.paragraph(),
      userId,
      channelId,
    },
    include: { Users: true },
  });
}

function likeStory(storyId: number, userId: number) {
  return prisma.likes.create({
    data: {
      storyId,
      userId,
    },
  });
}

export { createStory, createStoryOfChannel, likeStory };
