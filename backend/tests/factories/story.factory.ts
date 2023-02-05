import { Comments, StorieStatus } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { prisma } from "../../src/database";

function createStory(userId: number) {
  return prisma.channels.create({
    data: {
      name: faker.internet.userName().concat(faker.random.alphaNumeric(3)),
      background: faker.image.abstract(),
      Stories: {
        create: {
          title: faker.lorem.word(5),
          body: faker.lorem.words(5),
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

function createBannedStoryOfChannel(userId: number, channelId: number) {
  return prisma.stories.create({
    data: {
      title: faker.lorem.word(5),
      body: faker.lorem.words(5),
      userId,
      channelId,
      status: StorieStatus.BANNED,
    },
    include: { Users: true },
  });
}

function createStoryOfChannel(userId: number, channelId: number) {
  return prisma.stories.create({
    data: {
      title: faker.lorem.word(5),
      body: faker.lorem.words(5),
      userId,
      channelId,
    },
    include: { Users: true },
  });
}

function createComment(data: CreateCommentParams) {
  return prisma.comments.create({
    data: {
      ...data,
      text: faker.lorem.words(5),
    },
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

function denounceStory(storyId: number, userId: number) {
  return prisma.denunciations.create({
    data: {
      storyId,
      userId,
      text: faker.lorem.words(5),
    },
  });
}

type CreateCommentParams = Omit<Comments, "id" | "text">;

export { createStory, createStoryOfChannel, createBannedStoryOfChannel, createComment, likeStory, denounceStory };
