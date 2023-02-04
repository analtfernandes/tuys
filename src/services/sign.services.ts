import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Users } from "@prisma/client";
import { badRequestError, conflictError, notFoundError, signUpError } from "../helpers/errors.helper";
import { RanksHelper } from "../helpers/ranks.helper";
import * as signRepository from "../repositories/sign.repository";
import * as rankRepository from "../repositories/rank.repository";

async function postSignUp(data: PostSignUpParams) {
  const haveUserWithEmail = await signRepository.findUserByEmail(data.email);
  if (haveUserWithEmail) throw conflictError();

  const haveUserWithUsername = await signRepository.findUserByUsername(data.username);
  if (haveUserWithUsername) throw conflictError();

  const hashedPassword = await bcrypt.hash(data.password, 13);
  const rank = await rankRepository.findRankByName(RanksHelper.LEVEL_1.name);

  if (!rank) {
    const insertedRank = await rankRepository.createRanks();

    if (insertedRank) {
      return signRepository.createUser({ ...data, password: hashedPassword, rankId: insertedRank.id });
    }

    throw signUpError();
  }

  return signRepository.createUser({ ...data, password: hashedPassword, rankId: rank.id });
}

async function postSignIn(data: PostSignInParams) {
  const user = await signRepository.findUserByEmail(data.email);

  if (!user || !bcrypt.compareSync(data.password, user.password)) {
    throw notFoundError();
  }

  const userHaveActiveSession = await signRepository.findActiveSessionByUserId(user.id);

  if (userHaveActiveSession) throw badRequestError();

  const token = jwt.sign({ user: user.id }, process.env.JWT_SECRET || "JWT_KEY");

  await signRepository.createSession({ userId: user.id, token });

  return { token, id: user.id, username: user.username, avatar: user.avatar, rankColor: user.Ranks.color };
}

type PostSignUpParams = Omit<Users, "id" | "about" | "rankId" | "status">;
type PostSignInParams = Omit<PostSignUpParams, "username" | "avatar">;

export { postSignUp, postSignIn };
