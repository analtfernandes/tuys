import { faker } from "@faker-js/faker";
import { Users, UserStatus } from "@prisma/client";
import { prisma } from "../../src/database";

function createCustomUser(data: CreateCustomUserParams) {
  return prisma.ranks.create({
    data: {
      name: faker.random.alphaNumeric(3).concat(faker.random.alphaNumeric(3)),
      color: faker.internet.color(),
      Users: {
        create: {
          username: faker.internet.userName().concat(faker.random.alphaNumeric(3)),
          avatar: faker.image.avatar(),
          email: faker.internet.email(),
          password: faker.internet.password(),
          about: faker.lorem.words(5),
          status: UserStatus.ACTIVE,
          ...data,
        },
      },
    },
    select: {
      Users: true,
    },
  });
}

function createCustomUserWithRank(rankId: number, data?: CreateCustomUserParams) {
  return prisma.users.create({
    data: {
      username: faker.internet.userName().concat(faker.random.alphaNumeric(3)),
      avatar: faker.image.avatar(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      about: faker.lorem.words(5),
      status: UserStatus.ACTIVE,
      rankId,
      ...data,
    },
  });
}

type CreateCustomUserParams = Partial<Omit<Users, "id">>;

export { createCustomUser, createCustomUserWithRank };
