import { Router } from "express";
import { authenticationMiddleware } from "../middlewares";
import { getNotifications } from "../controllers/notification.controller";

const notificationRoute = Router();

notificationRoute.all("/*", authenticationMiddleware).get("/", getNotifications);

export { notificationRoute };
