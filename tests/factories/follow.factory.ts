import { Follows } from "@prisma/client";
import { prisma } from "../../src/database";

function createFollow(data: CreateFollowParams) {
  return prisma.follows.create({
    data: {
      ...data,
    },
  });
}

type CreateFollowParams = Omit<Follows, "id">;

export { createFollow };
