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

async function postChannel(req: Request, res: Response) {
  try {
    const channel = await channelService.postChannel(req.body);
    return responseHelper.CREATED({ res, body: channel });
  } catch (error: any) {
    if (error.name === "BadRequest") {
      return responseHelper.BAD_REQUEST({ res, body: { message: `Já existe um canal chamado ${req.body.name}!` } });
    }

    return responseHelper.SERVER_ERROR({ res });
  }
}

async function putChannel(req: Request, res: Response) {
  try {
    await channelService.putChannel({ ...req.body, id: Number(req.params.channelId) });
    return responseHelper.NO_CONTENT({ res });
  } catch (error: any) {
    if (error.name === "NotFound") {
      return responseHelper.NOT_FOUND({ res, body: { message: "Canal não existe!" } });
    }

    if (error.name === "BadRequest") {
      return responseHelper.BAD_REQUEST({ res, body: { message: error.message } });
    }

    return responseHelper.SERVER_ERROR({ res });
  }
}

export { getAll, postChannel, putChannel };
