import supertest from "supertest";
import httpStatus from "http-status";
import { faker } from "@faker-js/faker";
import { UserStatus } from "@prisma/client";
import server from "../../src/server";
import { prisma } from "../../src/database";
import { generateValidToken, generateValidUser } from "../helpers/generateValidData";
import { cleanDatabase } from "../helpers/cleanDatabase";
import { createSession, updateActiveSession } from "../factories";

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

describe("POST /auth/sign-in", () => {
  const route = "/auth/sign-in";

  it("should return status 400 when sent body is invalid", async () => {
    const body = { [faker.word.adjective()]: faker.word.adverb() };
    const response = await app.post(route).send(body);
    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it("should return status 404 when does not exist user with sent email", async () => {
    const body = {
      email: faker.internet.email(),
      password: faker.internet.password(6),
    };

    const response = await app.post(route).send(body);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it("should return status 404 when exist user with sent email but password is wrong", async () => {
    const user = await generateValidUser();
    const body = {
      email: user.email,
      password: faker.internet.password(6),
    };

    const response = await app.post(route).send(body);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it("should return status 400 when user have three active session", async () => {
    const user = await generateValidUser();
    await createSession({ userId: user.id, token: "token" });
    await createSession({ userId: user.id, token: "token" });
    await generateValidToken(user);
    const body = {
      email: user.email,
      password: user.password,
    };

    const response = await app.post(route).send(body);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  describe("when body is valid", () => {
    it("should return status 200 and user data with his session token", async () => {
      const user = await generateValidUser();
      await generateValidToken(user);
      const body = {
        email: user.email,
        password: user.password,
      };

      const response = await app.post(route).send(body);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({
        id: user.id,
        username: user.username,
        avatar: user.avatar,
        token: expect.any(String),
        rankColor: expect.any(String),
      });
    });

    it("should save a new session in database", async () => {
      const user = await generateValidUser();
      const body = {
        email: user.email,
        password: user.password,
      };

      const beforeCount = await prisma.sessions.count();

      await app.post(route).send(body);

      const afterCount = await prisma.sessions.count();

      expect(afterCount).toBe(beforeCount + 1);
    });
  });
});

describe("POST /auth/sign-out", () => {
  const route = "/auth/sign-out";

  it("should return status 401 when user don't have an active session", async () => {
    const { authorization, session } = await generateValidToken();
    await updateActiveSession(session.id);

    const response = await app.post(route).set("Authorization", authorization);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should return status 204", async () => {
    const { authorization } = await generateValidToken();

    const response = await app.post(route).set("Authorization", authorization);

    expect(response.status).toBe(httpStatus.NO_CONTENT);
  });

  it("should set the session as inactive in database", async () => {
    const { authorization, session } = await generateValidToken();

    await app.post(route).set("Authorization", authorization);

    const updatedSession = await prisma.sessions.findUnique({ where: { id: session.id } });

    expect(updatedSession).not.toBeNull();
    expect(updatedSession?.active).toBe(false);
  });
});
