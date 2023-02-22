import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Users } from "@prisma/client";
import { badRequestError, conflictError, notFoundError, signUpError } from "../helpers/errors.helper";
import { RanksHelper } from "../helpers/ranks.helper";
import * as signRepository from "../repositories/sign.repository";
import * as rankRepository from "../repositories/rank.repository";
import { faker } from "@faker-js/faker";

async function postSignUp(data: PostSignUpParams) {
  const haveUserWithEmail = await signRepository.findUserByEmail(data.email);
  if (haveUserWithEmail) throw conflictError();

  const haveUserWithUsername = await signRepository.findUserByUsername(data.username);
  if (haveUserWithUsername) throw conflictError();

  const hashedPassword = await bcrypt.hash(data.password, 13);
  const rank = await getNewUserRank();

  return signRepository.createUser({ ...data, password: hashedPassword, rankId: rank.id });
}

async function postSignIn(data: PostSignInParams) {
  const user = await signRepository.findUserByEmail(data.email);

  if (!user || !bcrypt.compareSync(data.password, user.password)) {
    throw notFoundError();
  }

  const userActivesSessionsCount = await signRepository.countActiveSessionsByUserId(user.id);
  if (userActivesSessionsCount >= 3) throw badRequestError();

  const token = jwt.sign({ user: user.id }, process.env.JWT_SECRET || "JWT_KEY");

  await signRepository.createSession({ userId: user.id, token });

  return {
    token,
    id: user.id,
    username: user.username,
    avatar: user.avatar,
    rankColor: user.Ranks.color,
    status: user.status,
  };
}

async function postSignWithGoogle(data: PostSignUpParams) {
  const user = await signRepository.findUserByEmail(data.email);

  if (!user) return signUpGoogle(data);

  if (user.password !== data.password) throw conflictError();

  return signInGoogle(user);
}

async function postSignOut(userId: number) {
  const session = await signRepository.findActiveSessionByUserId(userId);
  if (!session) throw notFoundError();

  return signRepository.updateActiveSessionId(session.id);
}

async function signUpGoogle(data: PostSignUpParams) {
  const rank = await getNewUserRank();
  const username = data.username.replace(" ", "").slice(0, 19).concat(faker.random.numeric(4));
  const newUser = await signRepository.createUser({ ...data, username, rankId: rank.id });

  const token = jwt.sign({ user: newUser.id }, process.env.JWT_SECRET || "JWT_KEY");

  await signRepository.createSession({ userId: newUser.id, token });

  return {
    token,
    id: newUser.id,
    username: newUser.username,
    avatar: newUser.avatar,
    rankColor: rank.color,
    status: newUser.status,
  };
}

async function signInGoogle(user: SignInGoogleParams) {
  const userActivesSessionsCount = await signRepository.countActiveSessionsByUserId(user.id);
  if (userActivesSessionsCount >= 3) throw badRequestError();

  const token = jwt.sign({ user: user.id }, process.env.JWT_SECRET || "JWT_KEY");

  await signRepository.createSession({ userId: user.id, token });

  return {
    token,
    id: user.id,
    username: user.username,
    avatar: user.avatar,
    rankColor: user.Ranks.color,
    status: user.status,
  };
}

async function getNewUserRank() {
  const rank = await rankRepository.findRankByName(RanksHelper.LEVEL_1.name);

  if (!rank) {
    const insertedRank = await rankRepository.createRanks();

    if (!insertedRank) {
      throw signUpError();
    }

    return insertedRank;
  }

  return rank;
}

type PostSignUpParams = Omit<Users, "id" | "about" | "rankId" | "status">;
type PostSignInParams = Omit<PostSignUpParams, "username" | "avatar">;
type SignInGoogleParams = Users & {
  Ranks: {
    color: string;
  };
};

export { postSignUp, postSignIn, postSignOut, postSignWithGoogle };
