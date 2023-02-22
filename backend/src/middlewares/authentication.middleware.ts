import { UserStatus } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import * as responseHelper from "../helpers/response.helper";
import { findUserById } from "../repositories/user.repository";
import { findActiveSessionByUserId } from "../repositories/sign.repository";

export function authenticationMiddleware({ validateUserStatus = false }) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) return responseHelper.UNAUTHORIZED({ res });

    try {
      const JwtSecret = process.env.JWT_SECRET || "";
      const payload = jwt.verify(token, JwtSecret) as JwtPayload;

      const session = await findActiveSessionByUserId(payload.user);
      if (!session) return responseHelper.UNAUTHORIZED({ res });

      if (validateUserStatus && req.method !== "GET") {
        const user = await findUserById(payload.user);
        if (!user || user.status === UserStatus.BANNED) {
          return responseHelper.FORBIDDEN({
            res,
            body: { message: "Essa ação é proibida, pois o usuário está banido!" },
          });
        }
      }

      res.locals.userId = payload.user;
      res.locals.sessionId = session.id;

      next();
    } catch (error) {
      return responseHelper.UNAUTHORIZED({ res });
    }
  };
}

type JwtPayload = {
  user: number;
};
