import supertest from "supertest";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import { faker } from "@faker-js/faker";
import server from "../../src/server";
import { prisma } from "../../src/database";
import { createChannel, createStoryOfChannel, likeStory } from "../factories";
import { generateValidToken, generateValidUser } from "../helpers/generateValidData";
import { cleanDatabase } from "../helpers/cleanDatabase";

const app = supertest(server);

beforeAll(async () => {
  await cleanDatabase();
});

afterAll(async () => {
  await cleanDatabase();
});

describe("GET /ranking", () => {
  const route = "/ranking";

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

    it("should return 200 and ranking", async () => {
      const user = await generateValidUser();
      const authorization = await generateValidToken(user);
      const channel = await createChannel();
      const story = await createStoryOfChannel(user.id, channel.id);
      await likeStory(story.id, user.id);
      await likeStory(story.id, user.id);

      for (let i = 0; i <= 20; i++) {
        await prisma.$transaction(async () => {
          const story = await createStoryOfChannel(user.id, channel.id);
          await likeStory(story.id, user.id);
        });
      }

      const response = await app.get(route).set("Authorization", authorization);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body.length).toBe(20);
      expect(response.body[0]).toEqual({
        id: story.id,
        title: story.title,
        body: story.body,
        userId: story.Users.id,
        date: story.date.toISOString(),
        owner: {
          isOwner: true,
          status: story.Users.status,
          username: story.Users.username,
          avatar: story.Users.avatar,
          rankColor: expect.any(String),
        },
        likedByUser: true,
        followedByUser: false,
        likes: 2,
        comments: 0,
        channel: channel.name,
      });
    });
  });
});
