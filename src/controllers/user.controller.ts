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

export { getUserData };
