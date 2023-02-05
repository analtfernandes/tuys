import { Router } from "express";
import { authenticationMiddleware } from "../middlewares";
import { getNotifications, postNotificationRead } from "../controllers/notification.controller";

const notificationRoute = Router();

notificationRoute
  .all("/*", authenticationMiddleware)
  .get("/", getNotifications)
  .post("/:notificationId/read", postNotificationRead);

export { notificationRoute };
