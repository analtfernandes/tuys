import { StorieStatus } from "@prisma/client";
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

async function getUserResgiter(req: Request, res: Response) {
  const userId: number = res.locals.userId;

  try {
    const user = await userService.getUserResgiter(userId);
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
  const status = req.query.status === StorieStatus.BANNED ? StorieStatus.BANNED : StorieStatus.ACTIVE;
  const likedByUser = req.query.liked === "true";

  try {
    const stories = await userService.getUserStories(userId, status, likedByUser);
    return responseHelper.OK({ res, body: stories });
  } catch (error: any) {
    if (error.name === "NotFound") {
      return responseHelper.NOT_FOUND({ res });
    }

    return responseHelper.SERVER_ERROR({ res });
  }
}

async function getUserFollowers(req: Request, res: Response) {
  const userId: number = Number(req.params.userId) || res.locals.userId;

  try {
    const followers = await userService.getUserFollowers(userId);
    return responseHelper.OK({ res, body: followers });
  } catch (error: any) {
    if (error.name === "NotFound") {
      return responseHelper.NOT_FOUND({ res, body: { message: "Usuário não encontrado!" } });
    }

    return responseHelper.SERVER_ERROR({ res, body: { message: "" } });
  }
}

async function getWhoUserIsFollowing(req: Request, res: Response) {
  const userId: number = Number(req.params.userId) || res.locals.userId;

  try {
    const following = await userService.getWhoUserIsFollowing(userId);
    return responseHelper.OK({ res, body: following });
  } catch (error: any) {
    if (error.name === "NotFound") {
      return responseHelper.NOT_FOUND({ res, body: { message: "Usuário não encontrado!" } });
    }

    return responseHelper.SERVER_ERROR({ res, body: { message: "" } });
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
  const likedByUser = req.query.liked === "true";

  try {
    const stories = await userService.getUserStoriesByUserId(userId, wantedUser, likedByUser);
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

async function putUser(req: Request, res: Response) {
  const userId: number = res.locals.userId;
  const userIdParams = Number(req.params.userId);

  if (userId !== userIdParams) {
    return responseHelper.UNAUTHORIZED({ res });
  }

  try {
    await userService.putUser(userIdParams, req.body);
    return responseHelper.NO_CONTENT({ res });
  } catch (error: any) {
    if (error.name === "NotFound") {
      return responseHelper.NOT_FOUND({ res, body: { message: "Usuário não encontrado!" } });
    }

    if (error.name === "BadRequest") {
      return responseHelper.BAD_REQUEST({
        res,
        body: { message: `Já existe um usuário chamado ${req.body.username}!` },
      });
    }

    return responseHelper.SERVER_ERROR({ res });
  }
}

export {
  getUserData,
  getUserResgiter,
  getUserStories,
  getUserFollowers,
  getWhoUserIsFollowing,
  getUsersByUsername,
  getUserDataByUserId,
  getUserStoriesByUserId,
  postFollow,
  postUnfollow,
  putUser,
};
