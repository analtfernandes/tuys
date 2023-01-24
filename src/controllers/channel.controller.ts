import { Request, Response } from "express";
import * as responseHelper from "../helpers/response.helper";
import * as channelService from "../services/channel.services";

async function getAll(req: Request, res: Response) {
  try {
    const channels = await channelService.getAll();
    return responseHelper.OK({ res, body: channels });
  } catch (error) {
    return responseHelper.SERVER_ERROR({ res });
  }
}

export { getAll };
