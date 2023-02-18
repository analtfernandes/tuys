import { Request, Response } from "express";
import * as responseHelper from "../helpers/response.helper";
import * as notificationService from "../services/notification.services";

async function getNotifications(req: Request, res: Response) {
  const userId: number = res.locals.userId;

  try {
    const notifications = await notificationService.getNotifications(userId);
    return responseHelper.OK({ res, body: notifications });
  } catch (error: any) {
    return responseHelper.SERVER_ERROR({ res, body: { message: "" } });
  }
}

async function postNotificationRead(req: Request, res: Response) {
  const userId: number = res.locals.userId;
  const notificationId = Number(req.params.notificationId) || null;

  if (!notificationId || notificationId < 1) {
    return responseHelper.BAD_REQUEST({ res, body: { message: "Id de notificação inválido!" } });
  }

  try {
    await notificationService.postNotificationRead(userId, notificationId);
    return responseHelper.NO_CONTENT({ res });
  } catch (error: any) {
    if (error.name === "NotFound") {
      return responseHelper.NOT_FOUND({ res, body: { message: "Notificação não encontrada!" } });
    }

    if (error.name === "Unauthorized") {
      return responseHelper.UNAUTHORIZED({ res });
    }

    if (error.name === "BadRequest") {
      return responseHelper.BAD_REQUEST({ res, body: { message: "Notificação já está lida!" } });
    }

    return responseHelper.SERVER_ERROR({ res });
  }
}

export { getNotifications, postNotificationRead };
