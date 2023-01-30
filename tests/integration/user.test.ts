import supertest from "supertest";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import { faker } from "@faker-js/faker";
import { UserStatus } from "@prisma/client";
import server from "../../src/server";
import { generateValidToken, generateValidUser } from "../helpers/generateValidData";
import { createStory, createFollow } from "../factories";
import { cleanDatabase } from "../helpers/cleanDatabase";

const app = supertest(server);

beforeAll(async () => {
  await cleanDatabase();
});

afterAll(async () => {
  await cleanDatabase();
});

describe("GET /users/me", () => {
  const route = "/users/me";

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

    it("should return 200 and an stories array", async () => {
      const user = await generateValidUser();
      await createStory(user.id);
      const otherUser = await generateValidUser();
      await createFollow({ followedId: user.id, followerId: otherUser.id });
      const authorization = await generateValidToken(user);

      const response = await app.get(route).set("Authorization", authorization);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({
        id: expect.any(Number),
        username: user.username,
        avatar: user.avatar,
        about: user.about,
        status: UserStatus.ACTIVE,
        rankName: expect.any(String),
        rankColor: expect.any(String),
        bannedStories: 0,
        createdStories: 1,
        followers: 1,
        following: 0,
      });
    });
  });
});

describe("GET /users/me/stories", () => {
  const route = "/users/me/stories";

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

    it("should return 200 and a stories array", async () => {
      const user = await generateValidUser();
      const channelWithStory = await createStory(user.id);
      const otherUser = await generateValidUser();
      await createStory(otherUser.id);
      const authorization = await generateValidToken(user);

      const response = await app.get(route).set("Authorization", authorization);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual([
        {
          id: channelWithStory.Stories[0].id,
          title: channelWithStory.Stories[0].title,
          body: channelWithStory.Stories[0].body,
          userId: channelWithStory.Stories[0].Users.id,
          date: channelWithStory.Stories[0].date.toISOString(),
          owner: {
            isOwner: true,
            status: channelWithStory.Stories[0].Users.status,
            username: channelWithStory.Stories[0].Users.username,
            avatar: channelWithStory.Stories[0].Users.avatar,
            rankColor: expect.any(String),
          },
          likedByUser: false,
          followedByUser: false,
          likes: 0,
          comments: 0,
          channel: channelWithStory.name,
        },
      ]);
    });
  });
});

describe("GET /users/:username", () => {
  const route = "/users";

  it("should return status 401 when no token is sent", async () => {
    const response = await app.get(`${route}/a`);
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should return status 401 when token is invalid", async () => {
    const authorization = `Bearer ${faker.lorem.word()}`;
    const response = await app.get(`${route}/a`).set("Authorization", authorization);
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should return status 401 if there is no active session for the user", async () => {
      const { id } = await generateValidUser();
      const token = jwt.sign({ user: id }, process.env.JWT_SECRET || "");
      const authorization = `Bearer ${token}`;

      const response = await app.get(`${route}/a`).set("Authorization", authorization);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should return 200 and an empty array when no username match", async () => {
      const user = await generateValidUser();
      const authorization = await generateValidToken(user);

      const response = await app.get(`${route}/z123`).set("Authorization", authorization);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual([]);
    });

    it("should return 200 and an users array", async () => {
      const user = await generateValidUser();
      const authorization = await generateValidToken(user);

      const response = await app.get(`${route}/${user.username.slice(1, 3)}`).set("Authorization", authorization);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual([
        {
          id: expect.any(Number),
          username: user.username,
          avatar: user.avatar,
          rankColor: expect.any(String),
          isUser: true,
          following: false,
        },
      ]);
    });
  });
});
