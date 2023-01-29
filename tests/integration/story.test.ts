import supertest from "supertest";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import { faker } from "@faker-js/faker";
import server from "../../src/server";
import { prisma } from "../../src/database";
import { generateValidToken, generateValidUser } from "../helpers/generateValidData";
import {
  createBannedStoryOfChannel,
  createChannel,
  createComment,
  createStory,
  createStoryOfChannel,
  denounceStory,
  likeStory,
} from "../factories";
import { cleanDatabase } from "../helpers/cleanDatabase";
import { StorieStatus, UserStatus } from "@prisma/client";
import { createFollow } from "../factories/follow.factory";

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

describe("POST /stories/:storyId/unlike", () => {
  const route = "/stories";
  const subRoute = "unlike";

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

    it("should return status 400 if user has not liked the story", async () => {
      const user = await generateValidUser();
      const authorization = await generateValidToken(user);
      const {
        Stories: [story],
      } = await createStory(user.id);

      const response = await app.post(`${route}/${story.id}/${subRoute}`).set("Authorization", authorization);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should return status 200", async () => {
      const user = await generateValidUser();
      const authorization = await generateValidToken(user);
      const {
        Stories: [story],
      } = await createStory(user.id);

      await likeStory(story.id, user.id);

      const response = await app.post(`${route}/${story.id}/${subRoute}`).set("Authorization", authorization);

      expect(response.status).toBe(httpStatus.OK);
    });

    it("should delete the like on database", async () => {
      const user = await generateValidUser();
      const authorization = await generateValidToken(user);
      const {
        Stories: [story],
      } = await createStory(user.id);
      await likeStory(story.id, user.id);

      const beforeCount = await prisma.likes.count();

      await app.post(`${route}/${story.id}/${subRoute}`).set("Authorization", authorization);

      const afterCount = await prisma.likes.count();

      expect(afterCount).toBe(beforeCount - 1);
    });
  });
});

describe("GET /stories/:storyId/comments", () => {
  const route = "/stories";
  const subRoute = "comments";

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

    it("should return status 400 if story id is invalid", async () => {
      const authorization = await generateValidToken();

      const response = await app.get(`${route}/0/${subRoute}`).set("Authorization", authorization);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should return status 404 if story does not exist", async () => {
      const authorization = await generateValidToken();

      const response = await app.get(`${route}/1/${subRoute}`).set("Authorization", authorization);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should return status 200 and an empty array if there is no comment", async () => {
      const user = await generateValidUser();
      const channelWithStory = await createStory(user.id);
      const authorization = await generateValidToken(user);

      const response = await app
        .get(`${route}/${channelWithStory.Stories[0].id}/${subRoute}`)
        .set("Authorization", authorization);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual([]);
    });

    it("should return status 200 and a comments array", async () => {
      const user = await generateValidUser();
      const channelWithStory = await createStory(user.id);
      const authorization = await generateValidToken(user);
      const comment = await createComment({ userId: user.id, storyId: channelWithStory.Stories[0].id });

      const response = await app
        .get(`${route}/${channelWithStory.Stories[0].id}/${subRoute}`)
        .set("Authorization", authorization);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual([
        {
          id: comment.id,
          userId: comment.userId,
          storyId: comment.storyId,
          text: comment.text,
          owner: {
            isOwner: true,
            username: user.username,
            avatar: user.avatar,
            rankColor: expect.any(String),
            status: user.status,
          },
          isOwnerFollower: false,
          commentedByAuthor: true,
        },
      ]);
    });
  });
});

describe("POST /stories/:storyId/comments", () => {
  const route = "/stories";
  const subRoute = "comments";

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

    it("should return status 400 if no body is sent", async () => {
      const authorization = await generateValidToken();

      const response = await app.post(`${route}/1/${subRoute}`).set("Authorization", authorization);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should return status 400 if the sent body is invalid", async () => {
      const authorization = await generateValidToken();
      const body = { [faker.lorem.word()]: faker.lorem.word() };

      const response = await app.post(`${route}/1/${subRoute}`).set("Authorization", authorization).send(body);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    describe("when body is valid", () => {
      const body = {
        text: faker.lorem.word(10),
      };

      it("should return status 404 if story does not exist", async () => {
        const authorization = await generateValidToken();

        const response = await app.post(`${route}/1/${subRoute}`).set("Authorization", authorization).send(body);

        expect(response.status).toBe(httpStatus.NOT_FOUND);
      });

      it("should return status 201 and the comment id", async () => {
        const user = await generateValidUser();
        const channelWithStory = await createStory(user.id);
        const authorization = await generateValidToken(user);

        const response = await app
          .post(`${route}/${channelWithStory.Stories[0].id}/${subRoute}`)
          .set("Authorization", authorization)
          .send(body);

        expect(response.status).toBe(httpStatus.CREATED);
        expect(response.body).toEqual({ id: expect.any(Number) });
      });

      it("should save a new comment in database", async () => {
        const user = await generateValidUser();
        const channelWithStory = await createStory(user.id);
        const authorization = await generateValidToken(user);

        const beforeCount = await prisma.comments.count();

        await app
          .post(`${route}/${channelWithStory.Stories[0].id}/${subRoute}`)
          .set("Authorization", authorization)
          .send(body);

        const afterCount = await prisma.comments.count();

        expect(afterCount).toBe(beforeCount + 1);
      });
    });
  });
});

describe("POST /stories/:storyId/denounce", () => {
  const route = "/stories";
  const subRoute = "denounce";

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

    it("should return status 400 if no body is sent", async () => {
      const authorization = await generateValidToken();

      const response = await app.post(`${route}/1/${subRoute}`).set("Authorization", authorization);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should return status 400 if the sent body is invalid", async () => {
      const authorization = await generateValidToken();
      const body = { [faker.lorem.word()]: faker.lorem.word() };

      const response = await app.post(`${route}/1/${subRoute}`).set("Authorization", authorization).send(body);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    describe("when body is valid", () => {
      const body = {
        text: faker.lorem.word(10),
      };

      it("should return status 404 if story does not exist", async () => {
        const authorization = await generateValidToken();

        const response = await app.post(`${route}/1/${subRoute}`).set("Authorization", authorization).send(body);

        expect(response.status).toBe(httpStatus.NOT_FOUND);
      });

      it("should return status 204", async () => {
        const user = await generateValidUser();
        const channelWithStory = await createStory(user.id);
        const authorization = await generateValidToken(user);

        const response = await app
          .post(`${route}/${channelWithStory.Stories[0].id}/${subRoute}`)
          .set("Authorization", authorization)
          .send(body);

        expect(response.status).toBe(httpStatus.NO_CONTENT);
      });

      it("should save a new denounce in database", async () => {
        const user = await generateValidUser();
        const channelWithStory = await createStory(user.id);
        const authorization = await generateValidToken(user);

        const beforeCount = await prisma.denunciations.count();

        await app
          .post(`${route}/${channelWithStory.Stories[0].id}/${subRoute}`)
          .set("Authorization", authorization)
          .send(body);

        const afterCount = await prisma.denunciations.count();

        expect(afterCount).toBe(beforeCount + 1);
      });

      it(`should set the story status to '${StorieStatus.BANNED}' if there is three denounces to it`, async () => {
        const user = await generateValidUser();
        const { Stories } = await createStory(user.id);
        const authorization = await generateValidToken(user);
        await denounceStory(Stories[0].id, user.id);
        await denounceStory(Stories[0].id, user.id);

        await app.post(`${route}/${Stories[0].id}/${subRoute}`).set("Authorization", authorization).send(body);

        const story = await prisma.stories.findUnique({ where: { id: Stories[0].id } });

        expect(story?.status).toBe(StorieStatus.BANNED);
      });

      it(`should set the user status to '${UserStatus.BANNED}' if user have five banned stories`, async () => {
        const user = await generateValidUser();
        const authorization = await generateValidToken(user);
        const channel = await createChannel();
        await createBannedStoryOfChannel(user.id, channel.id);
        await createBannedStoryOfChannel(user.id, channel.id);
        await createBannedStoryOfChannel(user.id, channel.id);
        await createBannedStoryOfChannel(user.id, channel.id);
        const lastStory = await createStoryOfChannel(user.id, channel.id);

        await app.post(`${route}/${lastStory.id}/${subRoute}`).set("Authorization", authorization).send(body);

        const bannedUser = await prisma.users.findUnique({ where: { id: user.id } });

        expect(bannedUser?.status).toBe(UserStatus.BANNED);
      });
    });
  });
});

describe("DELETE /stories/:storyId", () => {
  const route = "/stories";

  it("should return status 401 when no token is sent", async () => {
    const response = await app.delete(`${route}/1`);
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should return status 401 when token is invalid", async () => {
    const authorization = `Bearer ${faker.lorem.word()}`;
    const response = await app.delete(`${route}/1`).set("Authorization", authorization);
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should return status 401 if there is no active session for the user", async () => {
      const { id } = await generateValidUser();
      const token = jwt.sign({ user: id }, process.env.JWT_SECRET || "");
      const authorization = `Bearer ${token}`;

      const response = await app.delete(`${route}/1`).set("Authorization", authorization);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should return status 400 if params 'storyId' is invalid", async () => {
      const authorization = await generateValidToken();

      const response = await app.delete(`${route}/0`).set("Authorization", authorization);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should return status 404 if story does not exist", async () => {
      const authorization = await generateValidToken();

      const response = await app.delete(`${route}/1`).set("Authorization", authorization);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should return status 401 if user is not the owner of story", async () => {
      const user = await generateValidUser();
      const authorization = await generateValidToken(user);
      const otherUser = await generateValidUser();
      const { Stories } = await createStory(otherUser.id);

      const response = await app.delete(`${route}/${Stories[0].id}`).set("Authorization", authorization);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should return status 204", async () => {
      const user = await generateValidUser();
      const authorization = await generateValidToken(user);
      const { Stories } = await createStory(user.id);

      const response = await app.delete(`${route}/${Stories[0].id}`).set("Authorization", authorization);

      expect(response.status).toBe(httpStatus.NO_CONTENT);
    });

    it("should delete the story in database", async () => {
      const user = await generateValidUser();
      const authorization = await generateValidToken(user);
      const { Stories } = await createStory(user.id);

      const beforeCount = await prisma.stories.count();

      await app.delete(`${route}/${Stories[0].id}`).set("Authorization", authorization);

      const afterCount = await prisma.stories.count();

      expect(afterCount).toBe(beforeCount - 1);
    });
  });
});

describe("PUT /stories/:storyId", () => {
  const route = "/stories";

  it("should return status 401 when no token is sent", async () => {
    const response = await app.put(`${route}/1`);
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should return status 401 when token is invalid", async () => {
    const authorization = `Bearer ${faker.lorem.word()}`;
    const response = await app.put(`${route}/1`).set("Authorization", authorization);
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should return status 401 if there is no active session for the user", async () => {
      const { id } = await generateValidUser();
      const token = jwt.sign({ user: id }, process.env.JWT_SECRET || "");
      const authorization = `Bearer ${token}`;

      const response = await app.put(`${route}/1`).set("Authorization", authorization);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should return status 400 if params 'storyId' is invalid", async () => {
      const authorization = await generateValidToken();

      const response = await app.put(`${route}/0`).set("Authorization", authorization).send({});

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should return status 400 if no body is sent", async () => {
      const authorization = await generateValidToken();

      const response = await app.put(`${route}/1`).set("Authorization", authorization);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should return status 400 if the sent body is invalid", async () => {
      const authorization = await generateValidToken();
      const body = { [faker.lorem.word()]: faker.lorem.word() };

      const response = await app.put(`${route}/1`).set("Authorization", authorization).send(body);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    describe("when body is valid", () => {
      const body = {
        title: faker.lorem.word(10),
        body: faker.lorem.words(10),
      };

      it("should return status 404 if story does not exist", async () => {
        const authorization = await generateValidToken();

        const response = await app.put(`${route}/1`).set("Authorization", authorization).send(body);

        expect(response.status).toBe(httpStatus.NOT_FOUND);
      });

      it("should return status 401 if user is not the owner of story", async () => {
        const user = await generateValidUser();
        const authorization = await generateValidToken(user);
        const otherUser = await generateValidUser();
        const { Stories } = await createStory(otherUser.id);

        const response = await app.put(`${route}/${Stories[0].id}`).set("Authorization", authorization).send(body);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });

      it("should return status 204", async () => {
        const user = await generateValidUser();
        const authorization = await generateValidToken(user);
        const { Stories } = await createStory(user.id);

        const response = await app.put(`${route}/${Stories[0].id}`).set("Authorization", authorization).send(body);

        expect(response.status).toBe(httpStatus.NO_CONTENT);
      });
    });
  });
});

describe("GET /stories", () => {
  const route = "/stories";

  it("should return status 401 when no token is sent", async () => {
    const response = await app.get(`${route}`);
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
      const channel = await createChannel();
      const firstUser = await generateValidUser();
      const firstStory = await createStoryOfChannel(firstUser.id, channel.id);
      const secondUser = await generateValidUser();
      const secondStory = await createStoryOfChannel(secondUser.id, channel.id);
      const thirdUser = await generateValidUser();
      await createStoryOfChannel(thirdUser.id, channel.id);

      await createFollow({ followedId: secondUser.id, followerId: firstUser.id });

      const authorization = await generateValidToken(firstUser);
      const response = await app.get(route).set("Authorization", authorization);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body.length).toBe(2);
      expect(response.body).toEqual(
        expect.arrayContaining([
          {
            id: firstStory.id,
            title: firstStory.title,
            body: firstStory.body,
            userId: firstStory.Users.id,
            date: firstStory.date.toISOString(),
            owner: {
              isOwner: true,
              status: firstStory.Users.status,
              username: firstStory.Users.username,
              avatar: firstStory.Users.avatar,
              rankColor: expect.any(String),
            },
            likedByUser: false,
            followedByUser: false,
            likes: 0,
            comments: 0,
            channel: channel.name,
          },
          {
            id: secondStory.id,
            title: secondStory.title,
            body: secondStory.body,
            userId: secondStory.Users.id,
            date: secondStory.date.toISOString(),
            owner: {
              isOwner: false,
              status: secondStory.Users.status,
              username: secondStory.Users.username,
              avatar: secondStory.Users.avatar,
              rankColor: expect.any(String),
            },
            likedByUser: false,
            followedByUser: true,
            likes: 0,
            comments: 0,
            channel: channel.name,
          },
        ]),
      );
    });
  });
});
