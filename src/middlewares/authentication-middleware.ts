import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import * as responseHelper from "../helpers/response-helper";
import { findActiveSessionByUserId } from "../repositories/sign.repository";

export async function authenticationMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) return responseHelper.UNAUTHORIZED({ res });

  try {
    const JwtSecret = process.env.JWT_SECRET || "";
    const payload = jwt.verify(token, JwtSecret) as JwtPayload;

    const session = await findActiveSessionByUserId(payload.user);

    if (!session) return responseHelper.UNAUTHORIZED({ res });

    res.locals.userId = payload.user;
    res.locals.sessionId = session.id;

    next();
  } catch (error) {
    return responseHelper.UNAUTHORIZED({ res });
  }
}

type JwtPayload = {
  user: number;
};
