import { Router } from "express";
import { authenticationMiddleware } from "../middlewares/authentication.middleware";
import { getAll } from "../controllers/channel.controller";

const channelRoute = Router();

channelRoute.all("/*", authenticationMiddleware).get("/", getAll);

export { channelRoute };
