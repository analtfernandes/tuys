import { Router } from "express";
import { authenticationMiddleware } from "../middlewares/authentication.middleware";
import { validateSchema } from "../middlewares/validateSchema.middleware";
import {
  allCommentsSchema,
  getStoriesAfterIdSchema,
  getStoriesByChannelIdSchema,
  postLikeSchema,
  postStorySchema,
} from "../schemas/story.schemas";
import {
  getAfterId,
  getAllOfChannel,
  getComments,
  postLikeStory,
  postStory,
  postUnlikeStory,
} from "../controllers/story.controller";

const storyRoute = Router();

storyRoute
  .all("/*", authenticationMiddleware)
  .get("/:channelId", validateSchema(getStoriesByChannelIdSchema, "params"), getAllOfChannel)
  .get("/:channelId/after/:storyId", validateSchema(getStoriesAfterIdSchema, "params"), getAfterId)
  .get("/:storyId/comments", validateSchema(allCommentsSchema, "params"), getComments)
  .post("/", validateSchema(postStorySchema), postStory)
  .post("/:storyId/like", validateSchema(postLikeSchema, "params"), postLikeStory)
  .post("/:storyId/unlike", validateSchema(postLikeSchema, "params"), postUnlikeStory);

export { storyRoute };
