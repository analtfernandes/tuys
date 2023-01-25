import supertest from "supertest";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import { faker } from "@faker-js/faker";
import server from "../../src/server";
import { prisma } from "../../src/database";
import { generateValidToken, generateValidUser } from "../helpers/generateValidData";
import { createChannel, createStory, createStoryOfChannel, likeStory } from "../factories";
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

describe("POST /stories", () => {
  const route = "/stories";

  it("should return status 401 when no token is sent", async () => {
    const response = await app.post(`${route}`);
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should return status 401 when token is invalid", async () => {
    const authorization = `Bearer ${faker.lorem.word()}`;
    const response = await app.post(`${route}`).set("Authorization", authorization);
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should return status 401 if there is no active session for the user", async () => {
      const { id } = await generateValidUser();
      const token = jwt.sign({ user: id }, process.env.JWT_SECRET || "");
      const authorization = `Bearer ${token}`;

      const response = await app.post(`${route}`).set("Authorization", authorization);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should return status 400 if no body is sent", async () => {
      const authorization = await generateValidToken();

      const response = await app.post(`${route}`).set("Authorization", authorization);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should return status 400 if the sent body is invalid", async () => {
      const authorization = await generateValidToken();
      const body = { [faker.lorem.word()]: faker.lorem.word() };

      const response = await app.post(`${route}`).set("Authorization", authorization).send(body);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    describe("when body is valid", () => {
      const body = {
        title: faker.lorem.word(10),
        body: faker.lorem.words(10),
      };

      it("should return status 404 if the channel with id on body property 'channelId' does not exist", async () => {
        const authorization = await generateValidToken();
        const newBody = { ...body, channelId: 1 };

        const response = await app.post(`${route}`).set("Authorization", authorization).send(newBody);

        expect(response.status).toBe(httpStatus.NOT_FOUND);
      });

      it("should return status 201 and story id", async () => {
        const authorization = await generateValidToken();
        const channel = await createChannel();
        const newBody = { ...body, channelId: channel.id };

        const response = await app.post(`${route}`).set("Authorization", authorization).send(newBody);

        expect(response.status).toBe(httpStatus.CREATED);
        expect(response.body).toEqual({ id: expect.any(Number) });
      });

      it("should save a new story on database", async () => {
        const authorization = await generateValidToken();
        const channel = await createChannel();
        const newBody = { ...body, channelId: channel.id };

        const beforeCount = await prisma.stories.count();

        await app.post(`${route}`).set("Authorization", authorization).send(newBody);

        const afterCount = await prisma.stories.count();

        expect(afterCount).toBe(beforeCount + 1);
      });
    });
  });
});

describe("GET /stories/:channelId/after/:storyId", () => {
  const route = "/stories";
  const subRoute = "after";

  it("should return status 401 when no token is sent", async () => {
    const response = await app.get(`${route}/1/${subRoute}/1`);
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should return status 401 when token is invalid", async () => {
    const authorization = `Bearer ${faker.lorem.word()}`;
    const response = await app.get(`${route}/1/${subRoute}/1`).set("Authorization", authorization);
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should return status 401 if there is no active session for the user", async () => {
      const { id } = await generateValidUser();
      const token = jwt.sign({ user: id }, process.env.JWT_SECRET || "");
      const authorization = `Bearer ${token}`;

      const response = await app.get(`${route}/1/${subRoute}/1`).set("Authorization", authorization);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should return 400 if channel id is invalid", async () => {
      const authorization = await generateValidToken();

      const response = await app.get(`${route}/0/${subRoute}/1`).set("Authorization", authorization);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should return 400 if story id is invalid", async () => {
      const authorization = await generateValidToken();

      const response = await app.get(`${route}/1/${subRoute}/-1`).set("Authorization", authorization);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should return 404 if channel does not exist", async () => {
      const authorization = await generateValidToken();

      const response = await app.get(`${route}/1/${subRoute}/1`).set("Authorization", authorization);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should return 200 and an empty array", async () => {
      const user = await generateValidUser();
      const channelWithStory = await createStory(user.id);
      const authorization = await generateValidToken(user);

      const response = await app
        .get(`${route}/${channelWithStory.id}/${subRoute}/${channelWithStory.Stories[0].id}`)
        .set("Authorization", authorization);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual([]);
    });

    it("should return 200 and a stories array", async () => {
      const user = await generateValidUser();
      const channelWithStory = await createStory(user.id);
      const newStory = await createStoryOfChannel(user.id, channelWithStory.id);
      const authorization = await generateValidToken(user);

      const response = await app
        .get(`${route}/${channelWithStory.id}/${subRoute}/${channelWithStory.Stories[0].id}`)
        .set("Authorization", authorization);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual([
        {
          id: newStory.id,
          title: newStory.title,
          body: newStory.body,
          userId: newStory.Users.id,
          date: newStory.date.toISOString(),
          owner: {
            isOwner: true,
            status: newStory.Users.status,
            username: newStory.Users.username,
            avatar: newStory.Users.avatar,
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

describe("POST /stories/:storyId/like", () => {
  const route = "/stories";
  const subRoute = "like";

  it("should return status 401 when no token is sent", async () => {
    const response = await app.post(`${route}/1/${subRoute}`);
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should return status 401 when token is invalid", async () => {
    const authorization = `Bearer ${faker.lorem.word()}`;
    const response = await app.post(`${route}/1/${subRoute}`).set("Authorization", authorization);
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should return status 401 if there is no active session for the user", async () => {
      const { id } = await generateValidUser();
      const token = jwt.sign({ user: id }, process.env.JWT_SECRET || "");
      const authorization = `Bearer ${token}`;

      const response = await app.post(`${route}/1/${subRoute}`).set("Authorization", authorization);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should return status 400 if story id is invalid", async () => {
      const authorization = await generateValidToken();

      const response = await app.post(`${route}/0/${subRoute}`).set("Authorization", authorization);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should return status 404 if story does not exist", async () => {
      const authorization = await generateValidToken();

      const response = await app.post(`${route}/1/${subRoute}`).set("Authorization", authorization);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should return status 400 if user has already liked the story", async () => {
      const user = await generateValidUser();
      const authorization = await generateValidToken(user);
      const {
        Stories: [story],
      } = await createStory(user.id);

      await likeStory(story.id, user.id);

      const response = await app.post(`${route}/${story.id}/${subRoute}`).set("Authorization", authorization);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should return status 200", async () => {
      const user = await generateValidUser();
      const authorization = await generateValidToken(user);
      const {
        Stories: [story],
      } = await createStory(user.id);

      const response = await app.post(`${route}/${story.id}/${subRoute}`).set("Authorization", authorization);

      expect(response.status).toBe(httpStatus.OK);
    });

    it("should add a new like on database", async () => {
      const user = await generateValidUser();
      const authorization = await generateValidToken(user);
      const {
        Stories: [story],
      } = await createStory(user.id);

      const beforeCount = await prisma.likes.count();

      await app.post(`${route}/${story.id}/${subRoute}`).set("Authorization", authorization);

      const afterCount = await prisma.likes.count();

      expect(afterCount).toBe(beforeCount + 1);
    });
  });
});
