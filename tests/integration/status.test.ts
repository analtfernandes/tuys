import supertest from "supertest";
import server from "../../src/server";

const app = supertest(server);

describe("connection test", () => {
  it("should return 200 on route '/status'", async () => {
    const response = await app.get("/status");
    expect(response.status).toBe(200);
  });
});
