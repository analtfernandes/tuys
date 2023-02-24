import { faker } from "@faker-js/faker";
import { Channels } from "@prisma/client";
import { prisma } from "../../src/database";

function createChannel() {
  return prisma.channels.create({
    data: {
      name: faker.random.alphaNumeric(5).concat(faker.random.alphaNumeric(5)),
      background: faker.image.city(),
      editable: true,
    },
  });
}

function createCustomChannel(data: Partial<Omit<Channels, "id">>) {
  return prisma.channels.create({
    data: {
      name: faker.random.alphaNumeric(5).concat(faker.random.alphaNumeric(5)),
      background: faker.image.city(),
      ...data,
    },
  });
}

export { createChannel, createCustomChannel };
