import supertest from "supertest";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import { faker } from "@faker-js/faker";
import { UserStatus } from "@prisma/client";
import server from "../../src/server";
import { prisma } from "../../src/database";
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

      const response = await app.get(`${route}/${user.username.slice(0, 3)}`).set("Authorization", authorization);

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

describe("GET /users/user/:userId", () => {
  const route = "/users/user";

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

    it("should return status 400 if params 'userId' is invalid", async () => {
      const authorization = await generateValidToken();

      const response = await app.get(`${route}/0`).set("Authorization", authorization);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should return status 404 if user does not exist", async () => {
      const authorization = await generateValidToken();

      const response = await app.get(`${route}/1`).set("Authorization", authorization);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should return 200 and user data", async () => {
      const user = await generateValidUser();
      const authorization = await generateValidToken(user);
      const otherUser = await generateValidUser();
      await createStory(otherUser.id);
      await createFollow({ followedId: otherUser.id, followerId: user.id });
      await createFollow({ followedId: user.id, followerId: otherUser.id });

      const response = await app.get(`${route}/${otherUser.id}`).set("Authorization", authorization);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({
        id: expect.any(Number),
        username: otherUser.username,
        avatar: otherUser.avatar,
        about: otherUser.about,
        status: UserStatus.ACTIVE,
        rankName: expect.any(String),
        rankColor: expect.any(String),
        createdStories: 1,
        followers: 1,
        following: 1,
        isFollowing: true,
        isUser: false,
      });
    });
  });
});

describe("GET /users/:userId/stories", () => {
  const route = "/users";
  const subRoute = "stories";

  it("should return status 401 when no token is sent", async () => {
    const response = await app.get(`${route}/1/${subRoute}`);
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should return status 401 when token is invalid", async () => {
    const authorization = `Bearer ${faker.lorem.word()}`;
    const response = await app.get(`${route}/1/${subRoute}`).set("Authorization", authorization);
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should return status 401 if there is no active session for the user", async () => {
      const { id } = await generateValidUser();
      const token = jwt.sign({ user: id }, process.env.JWT_SECRET || "");
      const authorization = `Bearer ${token}`;

      const response = await app.get(`${route}/1/${subRoute}`).set("Authorization", authorization);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should return status 400 if params 'userId' is invalid", async () => {
      const authorization = await generateValidToken();

      const response = await app.get(`${route}/0/${subRoute}`).set("Authorization", authorization);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should return status 404 if user does not exist", async () => {
      const authorization = await generateValidToken();

      const response = await app.get(`${route}/1/${subRoute}`).set("Authorization", authorization);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should return 200 and an empty array if user has not stories", async () => {
      const user = await generateValidUser();
      await createStory(user.id);
      const authorization = await generateValidToken(user);
      const otherUser = await generateValidUser();

      const response = await app.get(`${route}/${otherUser.id}/${subRoute}`).set("Authorization", authorization);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual([]);
    });

    it("should return 200 and a stories array", async () => {
      const user = await generateValidUser();
      await createStory(user.id);
      const authorization = await generateValidToken(user);
      const otherUser = await generateValidUser();
      const channelWithStory = await createStory(otherUser.id);

      const response = await app.get(`${route}/${otherUser.id}/${subRoute}`).set("Authorization", authorization);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual([
        {
          id: channelWithStory.Stories[0].id,
          title: channelWithStory.Stories[0].title,
          body: channelWithStory.Stories[0].body,
          userId: channelWithStory.Stories[0].Users.id,
          date: channelWithStory.Stories[0].date.toISOString(),
          owner: {
            isOwner: false,
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

describe("POST /users/:userId/follow", () => {
  const route = "/users";
  const subRoute = "follow";

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

    it("should return status 400 if params 'userId' is invalid", async () => {
      const authorization = await generateValidToken();

      const response = await app.post(`${route}/0/${subRoute}`).set("Authorization", authorization);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should return status 404 if user does not exist", async () => {
      const authorization = await generateValidToken();

      const response = await app.post(`${route}/1/${subRoute}`).set("Authorization", authorization);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should return status 400 if user already follow the other user", async () => {
      const user = await generateValidUser();
      const authorization = await generateValidToken(user);
      const otherUser = await generateValidUser();
      await createFollow({ followedId: otherUser.id, followerId: user.id });

      const response = await app.post(`${route}/${otherUser.id}/${subRoute}`).set("Authorization", authorization);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should return status 400 if params 'userId' and the requester id are the same", async () => {
      const user = await generateValidUser();
      const authorization = await generateValidToken(user);

      const response = await app.post(`${route}/${user.id}/${subRoute}`).set("Authorization", authorization);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should return status 204", async () => {
      const user = await generateValidUser();
      const authorization = await generateValidToken(user);
      const otherUser = await generateValidUser();

      const response = await app.post(`${route}/${otherUser.id}/${subRoute}`).set("Authorization", authorization);

      expect(response.status).toBe(httpStatus.NO_CONTENT);
    });

    it("should add a new follow on database", async () => {
      const user = await generateValidUser();
      const authorization = await generateValidToken(user);
      const otherUser = await generateValidUser();

      const beforeCount = await prisma.follows.count();

      await app.post(`${route}/${otherUser.id}/${subRoute}`).set("Authorization", authorization);

      const afterCount = await prisma.follows.count();

      expect(afterCount).toBe(beforeCount + 1);
    });

    it("should save a new notification on database", async () => {
      const user = await generateValidUser();
      const authorization = await generateValidToken(user);
      const otherUser = await generateValidUser();

      const beforeCount = await prisma.notifications.count();

      await app.post(`${route}/${otherUser.id}/${subRoute}`).set("Authorization", authorization);

      const afterCount = await prisma.notifications.count();

      expect(afterCount).toBe(beforeCount + 1);
    });
  });
});

describe("POST /users/:userId/unfollow", () => {
  const route = "/users";
  const subRoute = "unfollow";

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

    it("should return status 400 if params 'userId' is invalid", async () => {
      const authorization = await generateValidToken();

      const response = await app.post(`${route}/0/${subRoute}`).set("Authorization", authorization);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should return status 404 if user does not exist", async () => {
      const authorization = await generateValidToken();

      const response = await app.post(`${route}/1/${subRoute}`).set("Authorization", authorization);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should return status 400 if user don't follow the other user", async () => {
      const user = await generateValidUser();
      const authorization = await generateValidToken(user);
      const otherUser = await generateValidUser();

      const response = await app.post(`${route}/${otherUser.id}/${subRoute}`).set("Authorization", authorization);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should return status 400 if params 'userId' and the requester id are the same", async () => {
      const user = await generateValidUser();
      const authorization = await generateValidToken(user);

      const response = await app.post(`${route}/${user.id}/${subRoute}`).set("Authorization", authorization);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should return status 204", async () => {
      const user = await generateValidUser();
      const authorization = await generateValidToken(user);
      const otherUser = await generateValidUser();
      await createFollow({ followedId: otherUser.id, followerId: user.id });

      const response = await app.post(`${route}/${otherUser.id}/${subRoute}`).set("Authorization", authorization);

      expect(response.status).toBe(httpStatus.NO_CONTENT);
    });

    it("should delete the follow from database", async () => {
      const user = await generateValidUser();
      const authorization = await generateValidToken(user);
      const otherUser = await generateValidUser();
      await createFollow({ followedId: otherUser.id, followerId: user.id });

      const beforeCount = await prisma.follows.count();

      await app.post(`${route}/${otherUser.id}/${subRoute}`).set("Authorization", authorization);

      const afterCount = await prisma.follows.count();

      expect(afterCount).toBe(beforeCount - 1);
    });
  });
});
