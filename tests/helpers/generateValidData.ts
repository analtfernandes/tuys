import { faker } from "@faker-js/faker";
import { Users } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createRank, createSession, createCustomUser } from "../factories";

async function generateValidUser() {
  const { id } = await createRank();
  const password = faker.word.noun();
  const hashedPassword = await bcrypt.hash(password, 13);
  const user = await createCustomUser({
    password: hashedPassword,
    rankId: id,
  });

  return { ...user, password };
}

async function generateValidToken(user?: Users) {
  const { id } = user || (await generateValidUser());
  const token = jwt.sign({ user: id }, process.env.JWT_SECRET || "");
  const authorization = `Bearer ${token}`;

  await createSession({ userId: id, token });

  return authorization;
}

export { generateValidUser, generateValidToken };
