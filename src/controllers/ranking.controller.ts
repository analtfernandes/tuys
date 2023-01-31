import { Request, Response } from "express";
import * as responseHelper from "../helpers/response.helper";
import * as rankingService from "../services/ranking.services";

async function getRanking(req: Request, res: Response) {
  const userId: number = res.locals.userId;

  try {
    const ranking = await rankingService.getRanking(userId);
    return responseHelper.OK({ res, body: ranking });
  } catch (error: any) {
    return responseHelper.SERVER_ERROR({ res });
  }
}

export { getRanking };
