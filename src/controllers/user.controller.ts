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

async function getUserDataByUserId(req: Request, res: Response) {
  const userId: number = res.locals.userId;
  const wantedUser = Number(req.params.userId);

  try {
    const user = await userService.getUserDataByUserId(userId, wantedUser);
    return responseHelper.OK({ res, body: user });
  } catch (error: any) {
    if (error.name === "NotFound") {
      return responseHelper.NOT_FOUND({ res });
    }

    return responseHelper.SERVER_ERROR({ res });
  }
}

async function getUserStoriesByUserId(req: Request, res: Response) {
  const userId: number = res.locals.userId;
  const wantedUser = Number(req.params.userId);

  try {
    const stories = await userService.getUserStoriesByUserId(userId, wantedUser);
    return responseHelper.OK({ res, body: stories });
  } catch (error: any) {
    if (error.name === "NotFound") {
      return responseHelper.NOT_FOUND({ res });
    }

    return responseHelper.SERVER_ERROR({ res });
  }
}

async function postFollow(req: Request, res: Response) {
  const followerId: number = res.locals.userId;
  const followedId = Number(req.params.userId);

  if (followerId === followedId) return responseHelper.BAD_REQUEST({ res, body: { message: "Ação proibida!" } });

  try {
    await userService.postFollow({ followerId, followedId });
    return responseHelper.NO_CONTENT({ res });
  } catch (error: any) {
    if (error.name === "NotFound") {
      return responseHelper.NOT_FOUND({ res, body: { message: "Usuário não encontrado!" } });
    }

    if (error.name === "BadRequest") {
      return responseHelper.BAD_REQUEST({ res, body: { message: "Usuário já é seguido!" } });
    }

    return responseHelper.SERVER_ERROR({ res });
  }
}

async function postUnfollow(req: Request, res: Response) {
  const followerId: number = res.locals.userId;
  const followedId = Number(req.params.userId);

  if (followerId === followedId) return responseHelper.BAD_REQUEST({ res, body: { message: "Ação proibida!" } });

  try {
    await userService.postUnfollow({ followerId, followedId });
    return responseHelper.NO_CONTENT({ res });
  } catch (error: any) {
    if (error.name === "NotFound") {
      return responseHelper.NOT_FOUND({ res, body: { message: "Usuário não encontrado!" } });
    }

    if (error.name === "BadRequest") {
      return responseHelper.BAD_REQUEST({ res, body: { message: "Usuário não é seguido!" } });
    }

    return responseHelper.SERVER_ERROR({ res });
  }
}

export {
  getUserData,
  getUserStories,
  getUsersByUsername,
  getUserDataByUserId,
  getUserStoriesByUserId,
  postFollow,
  postUnfollow,
};
