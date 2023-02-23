import { NextFunction, Request, Response } from "express";
import { RanksHelper } from "../helpers/ranks.helper";
import * as responseHelper from "../helpers/response.helper";
import { findUserById } from "../repositories/user.repository";

export async function validateAdminRankMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await findUserById(res.locals.userId);

    if (!user || user.Ranks.name !== RanksHelper.LEVEL_7.name) return responseHelper.UNAUTHORIZED({ res });

    res.locals.user = user;
    next();
  } catch (error) {
    return responseHelper.UNAUTHORIZED({ res });
  }
}
