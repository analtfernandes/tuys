import { Router } from "express";
import { authenticationMiddleware } from "../middlewares/authentication.middleware";
import { validateSchema } from "../middlewares/validateSchema.middleware";
import { getStoriesAfterIdSchema, getStoriesByChannelIdSchema, postStorySchema } from "../schemas/story.schemas";
import { getAfterId, getAllOfChannel, postStory } from "../controllers/story.controller";

const storyRoute = Router();

storyRoute
  .all("/*", authenticationMiddleware)
  .get("/:channelId", validateSchema(getStoriesByChannelIdSchema, "params"), getAllOfChannel)
  .post("/", validateSchema(postStorySchema), postStory)
  .get("/:channelId/after/:storyId", validateSchema(getStoriesAfterIdSchema, "params"), getAfterId);

export { storyRoute };
