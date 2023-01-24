import { faker } from "@faker-js/faker";
import { prisma } from "../../src/database";

function createChannel() {
  return prisma.channels.create({
    data: {
      name: faker.internet.userName(),
      background: faker.image.city(),
    },
  });
}

export { createChannel };
