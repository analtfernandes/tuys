import { Router } from "express";
import { authenticationMiddleware } from "../middlewares/authentication.middleware";
import { validateSchema } from "../middlewares/validateSchema.middleware";
import { getStoriesByChannelIdSchema } from "../schemas/story.schemas";
import { getAllOfChannel } from "../controllers/story.controller";

const storyRoute = Router();

storyRoute
  .all("/*", authenticationMiddleware)
  .get("/:channelId", validateSchema(getStoriesByChannelIdSchema, "params"), getAllOfChannel);

export { storyRoute };
