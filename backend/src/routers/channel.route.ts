import { Router } from "express";
import * as channelSchemas from "../schemas/channel.schemas";
import { validateSchema, authenticationMiddleware, validateAdminRankMiddleware } from "../middlewares";
import { getAll, postChannel, putChannel } from "../controllers/channel.controller";

const channelRoute = Router();

channelRoute
  .get("/", authenticationMiddleware({}), getAll)
  .all("/*", authenticationMiddleware({ validateUserStatus: true }), validateAdminRankMiddleware)
  .post("/", validateSchema(channelSchemas.postChannel), postChannel)
  .put(
    "/:channelId",
    validateSchema(channelSchemas.allChannelIdParams, "params"),
    validateSchema(channelSchemas.postChannel),
    putChannel,
  );

export { channelRoute };
