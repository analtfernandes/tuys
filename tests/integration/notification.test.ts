import supertest from "supertest";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import { faker } from "@faker-js/faker";
import server from "../../src/server";
import { createNotification } from "../factories";
import { generateValidToken, generateValidUser } from "../helpers/generateValidData";
import { cleanDatabase } from "../helpers/cleanDatabase";

const app = supertest(server);

beforeAll(async () => {
  await cleanDatabase();
});

afterAll(async () => {
  await cleanDatabase();
});

describe("GET /notifications", () => {
  const route = "/notifications";

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

    it("should return 200 and user notifications", async () => {
      const user = await generateValidUser();
      const authorization = await generateValidToken(user);
      const notificationExpect = await createNotification(user.id);

      const otherUser = await generateValidUser();
      await createNotification(otherUser.id);

      const response = await app.get(route).set("Authorization", authorization);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual([
        {
          id: expect.any(Number),
          toUserId: user.id,
          text: notificationExpect.text,
          date: notificationExpect.date.toISOString(),
          read: false,
          type: notificationExpect.type,
        },
      ]);
    });
  });
});
