import { Router } from "express";
import * as channelSchemas from "../schemas/channel.schemas";
import { validateSchema, authenticationMiddleware, validateAdminRankMiddleware } from "../middlewares";
import { getAll, postChannel } from "../controllers/channel.controller";

const channelRoute = Router();

channelRoute
  .get("/", authenticationMiddleware({}), getAll)
  .all("/*", authenticationMiddleware({ validateUserStatus: true }), validateAdminRankMiddleware)
  .post("/", validateSchema(channelSchemas.postChannel), postChannel);

export { channelRoute };
