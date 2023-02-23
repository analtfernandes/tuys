import supertest from "supertest";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import { faker } from "@faker-js/faker";
import server from "../../src/server";
import { prisma } from "../../src/database";
import {
  generateValidAdminUser,
  generateValidBannedUser,
  generateValidToken,
  generateValidUser,
} from "../helpers/generateValidData";
import { cleanDatabase } from "../helpers/cleanDatabase";
import { createChannel } from "../factories";

const app = supertest(server);

beforeAll(async () => {
  await cleanDatabase();
});

afterAll(async () => {
  await cleanDatabase();
});

describe("GET /channels", () => {
  const route = "/channels";

  it("should return status 401 when no token is sent", async () => {
    const response = await app.get(route);
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should return status 401 when token is invalid", async () => {
    const authorization = `Bearer ${faker.lorem.word()}`;
    const response = await app.get(route).set("Authorization", authorization);
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should return status 401 if there is no active session for the user", async () => {
      const { id } = await generateValidUser();
      const token = jwt.sign({ user: id }, process.env.JWT_SECRET || "");
      const authorization = `Bearer ${token}`;

      const response = await app.get(route).set("Authorization", authorization);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should return status 200 and an empty array if there is no channel created", async () => {
      const { authorization } = await generateValidToken();

      const response = await app.get(route).set("Authorization", authorization);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual([]);
    });

    it("should return status 200 and an array of channels", async () => {
      const { authorization } = await generateValidToken();
      const channel = await createChannel();

      const response = await app.get(route).set("Authorization", authorization);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual([
        {
          id: channel.id,
          name: channel.name,
          background: channel.background,
          editable: false,
        },
      ]);
    });
  });
});

describe("POST /channels", () => {
  const route = "/channels";

  it("should return status 401 when no token is sent", async () => {
    const response = await app.post(route);
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should return status 401 when token is invalid", async () => {
    const authorization = `Bearer ${faker.lorem.word()}`;
    const response = await app.post(route).set("Authorization", authorization);
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should return status 401 if there is no active session for the user", async () => {
      const { id } = await generateValidUser();
      const token = jwt.sign({ user: id }, process.env.JWT_SECRET || "");
      const authorization = `Bearer ${token}`;

      const response = await app.post(route).set("Authorization", authorization);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should return status 400 if body is invalid", async () => {
      const user = await generateValidAdminUser();
      const { authorization } = await generateValidToken(user);
      const body = { [faker.word.adjective()]: faker.color.rgb() };

      const response = await app.post(route).set("Authorization", authorization).send(body);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    describe("when body is valid", () => {
      const background = faker.internet.avatar();

      function createBody() {
        return {
          background,
          name: faker.random.alphaNumeric(5).concat(faker.random.alphaNumeric(5)),
        };
      }

      it("should return status 401 if user is banned", async () => {
        const user = await generateValidBannedUser();
        const { authorization } = await generateValidToken(user);
        const body = createBody();

        const response = await app.post(route).set("Authorization", authorization).send(body);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });

      it("should return status 401 if user is not Admin rank", async () => {
        const user = await generateValidUser();
        const { authorization } = await generateValidToken(user);
        const body = createBody();

        const response = await app.post(route).set("Authorization", authorization).send(body);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });

      it("should return status 400 if already have an channel with the sent name", async () => {
        const user = await generateValidAdminUser();
        const { authorization } = await generateValidToken(user);
        const channel = await createChannel();
        const body = { name: channel.name, background };

        const response = await app.post(route).set("Authorization", authorization).send(body);

        expect(response.status).toBe(httpStatus.BAD_REQUEST);
      });

      it("should return status 201 and the channel created id", async () => {
        const user = await generateValidAdminUser();
        const { authorization } = await generateValidToken(user);
        const body = createBody();

        const response = await app.post(route).set("Authorization", authorization).send(body);

        expect(response.status).toBe(httpStatus.CREATED);
        expect(response.body).toEqual({ id: expect.any(Number) });
      });

      it("should save a new channel with field 'editable' as 'true' in database", async () => {
        const user = await generateValidAdminUser();
        const { authorization } = await generateValidToken(user);
        const body = createBody();

        const response = await app.post(route).set("Authorization", authorization).send(body);

        const channel = await prisma.channels.findUnique({ where: { id: response.body.id } });

        expect(channel).toEqual({ id: response.body.id, name: body.name, background: body.background, editable: true });
      });
    });
  });
});
