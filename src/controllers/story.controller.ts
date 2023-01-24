import { Request, Response } from "express";
import * as responseHelper from "../helpers/response.helper";
import * as storyService from "../services/story.services";

async function getAllOfChannel(req: Request, res: Response) {
  const channelId = Number(req.params.channelId);
  const userId: number = res.locals.userId;

  try {
    const stories = await storyService.getAllOfChannel({ channelId, userId });
    return responseHelper.OK({ res, body: stories });
  } catch (error: any) {
    if (error.name === "NotFound") {
      return responseHelper.NOT_FOUND({ res, body: { message: "Esse canal não existe!" } });
    }

    return responseHelper.SERVER_ERROR({ res });
  }
}

async function postStory(req: Request, res: Response) {
  const userId: number = res.locals.userId;

  try {
    const createdStory = await storyService.postStory({ ...req.body, userId });
    return responseHelper.CREATED({ res, body: createdStory });
  } catch (error: any) {
    if (error.name === "NotFound") {
      return responseHelper.NOT_FOUND({ res, body: { message: "Esse canal não existe!" } });
    }

    return responseHelper.SERVER_ERROR({ res });
  }
}

export { getAllOfChannel, postStory };
