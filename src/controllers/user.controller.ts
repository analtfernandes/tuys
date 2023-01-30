import { Request, Response } from "express";
import * as responseHelper from "../helpers/response.helper";
import * as userService from "../services/user.services";

async function getUserData(req: Request, res: Response) {
  const userId: number = res.locals.userId;

  try {
    const user = await userService.getUserData(userId);
    return responseHelper.OK({ res, body: user });
  } catch (error: any) {
    if (error.name === "NotFound") {
      return responseHelper.NOT_FOUND({ res });
    }

    return responseHelper.SERVER_ERROR({ res });
  }
}

async function getUserStories(req: Request, res: Response) {
  const userId: number = res.locals.userId;

  try {
    const user = await userService.getUserStories(userId);
    return responseHelper.OK({ res, body: user });
  } catch (error: any) {
    if (error.name === "NotFound") {
      return responseHelper.NOT_FOUND({ res });
    }

    return responseHelper.SERVER_ERROR({ res });
  }
}

async function getUsersByUsername(req: Request, res: Response) {
  const userId: number = res.locals.userId;
  const username: string = req.params.username;

  try {
    const users = await userService.getUsersByUsername(userId, username);
    return responseHelper.OK({ res, body: users });
  } catch (error: any) {
    if (error.name === "NotFound") {
      return responseHelper.NOT_FOUND({ res });
    }

    return responseHelper.SERVER_ERROR({ res });
  }
}

export { getUserData, getUserStories, getUsersByUsername };
