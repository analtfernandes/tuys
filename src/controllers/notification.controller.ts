import { Request, Response } from "express";
import * as responseHelper from "../helpers/response.helper";
import * as notificationService from "../services/notification.services";

async function getNotifications(req: Request, res: Response) {
  const userId: number = res.locals.userId;

  try {
    const notifications = await notificationService.getNotifications(userId);
    return responseHelper.OK({ res, body: notifications });
  } catch (error: any) {
    return responseHelper.SERVER_ERROR({ res });
  }
}

export { getNotifications };
