import bcrypt from "bcrypt";
import { Users } from "@prisma/client";
import { conflictError, signUpError } from "../helpers/errors.helper";
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

type PostSignUpParams = Omit<Users, "id" | "about" | "rankId" | "status">;

export { postSignUp };
