import { Router } from "express";
import { authenticationMiddleware } from "../middlewares/authentication.middleware";
import { validateSchema } from "../middlewares/validateSchema.middleware";
import {
  getStoriesAfterIdSchema,
  getStoriesByChannelIdSchema,
  postLikeSchema,
  postStorySchema,
} from "../schemas/story.schemas";
import { getAfterId, getAllOfChannel, postLikeStory, postStory } from "../controllers/story.controller";

const storyRoute = Router();

storyRoute
  .all("/*", authenticationMiddleware)
  .get("/:channelId", validateSchema(getStoriesByChannelIdSchema, "params"), getAllOfChannel)
  .get("/:channelId/after/:storyId", validateSchema(getStoriesAfterIdSchema, "params"), getAfterId)
  .post("/", validateSchema(postStorySchema), postStory)
  .post("/:storyId/like", validateSchema(postLikeSchema, "params"), postLikeStory);

export { storyRoute };
