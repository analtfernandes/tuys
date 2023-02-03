import supertest from "supertest";
import httpStatus from "http-status";
import { faker } from "@faker-js/faker";
import { UserStatus } from "@prisma/client";
import server from "../../src/server";
import { prisma } from "../../src/database";
import { generateValidUser } from "../helpers/generateValidData";
import { cleanDatabase } from "../helpers/cleanDatabase";

const app = supertest(server);

beforeAll(async () => {
  await cleanDatabase();
});

afterAll(async () => {
  await cleanDatabase();
});

describe("POST /auth/sign-up", () => {
  const route = "/auth/sign-up";

  it("should return status 400 when sent body is invalid", async () => {
    const body = { [faker.word.adjective()]: faker.word.adverb() };
    const response = await app.post(route).send(body);
    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it("should return status 409 when property 'email' value in sent body is already used", async () => {
    const user = await generateValidUser();
    const body = {
      username: faker.internet.userName().concat(faker.random.alphaNumeric(3)),
      avatar: faker.image.avatar(),
      email: user.email,
      password: faker.internet.password(6),
    };

    const response = await app.post(route).send(body);

    expect(response.status).toBe(httpStatus.CONFLICT);
  });

  it("should return status 409 when property 'username' value in sent body is already used", async () => {
    const user = await generateValidUser();
    const body = {
      username: user.username,
      avatar: faker.image.avatar(),
      email: faker.internet.email(user.username),
      password: faker.internet.password(6),
    };

    const response = await app.post(route).send(body);

    expect(response.status).toBe(httpStatus.CONFLICT);
  });

  describe("when body is valid", () => {
    it("should return status 201", async () => {
      const body = {
        username: faker.internet.userName().concat(faker.random.alphaNumeric(3)),
        avatar: faker.image.avatar(),
        email: faker.internet.email(),
        password: faker.internet.password(6),
      };

      const response = await app.post(route).send(body);

      expect(response.status).toBe(httpStatus.CREATED);
    });

    it("should save a new user in database and hash his password", async () => {
      const body = {
        username: faker.internet.userName().concat(faker.random.alphaNumeric(3)),
        avatar: faker.image.avatar(),
        email: faker.internet.email(),
        password: faker.internet.password(6),
      };

      await app.post(route).send(body);

      const user = await prisma.users.findUnique({ where: { username: body.username } });

      expect(user).toEqual({
        id: expect.any(Number),
        username: body.username,
        avatar: body.avatar,
        email: body.email,
        password: expect.not.stringMatching(body.password),
        about: "",
        rankId: expect.any(Number),
        status: UserStatus.ACTIVE,
      });
    });
  });
});
