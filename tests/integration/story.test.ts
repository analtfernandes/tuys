import supertest from "supertest";
import server from "server";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import { faker } from "@faker-js/faker";
import { generateValidToken, generateValidUser } from "../helpers/generateValidData";
import { createStory } from "../factories";
import { cleanDatabase } from "../helpers/cleanDatabase";

const app = supertest(server);

beforeAll(async () => {
  await cleanDatabase();
});

afterAll(async () => {
  await cleanDatabase();
});

describe("GET /stories/:channelId", () => {
  const route = "/stories";

  it("should return status 401 when no token is sent", async () => {
    const response = await app.get(`${route}/1`);
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should return status 401 when token is invalid", async () => {
    const authorization = `Bearer ${faker.lorem.word()}`;
    const response = await app.get(`${route}/1`).set("Authorization", authorization);
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should return status 401 if there is no active session for the user", async () => {
      const { id } = await generateValidUser();
      const token = jwt.sign({ user: id }, process.env.JWT_SECRET || "");
      const authorization = `Bearer ${token}`;

      const response = await app.get(`${route}/1`).set("Authorization", authorization);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should return 400 if channel id is invalid", async () => {
      const authorization = await generateValidToken();

      const response = await app.get(`${route}/0`).set("Authorization", authorization);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should return 404 if channel does not exist", async () => {
      const authorization = await generateValidToken();

      const response = await app.get(`${route}/1`).set("Authorization", authorization);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should return 200 and an stories array", async () => {
      const user = await generateValidUser();
      const channelWithStory = await createStory(user.id);
      const authorization = await generateValidToken(user);

      const response = await app.get(`${route}/${channelWithStory.id}`).set("Authorization", authorization);

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
