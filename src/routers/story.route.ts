import { Router } from "express";
import { authenticationMiddleware } from "../middlewares/authentication.middleware";
import { validateSchema } from "../middlewares/validateSchema.middleware";
import {
  allCommentsParamsSchema,
  getStoriesAfterIdSchema,
  getStoriesByChannelIdSchema,
  postCommentSchema,
  postLikeSchema,
  postStorySchema,
} from "../schemas/story.schemas";
import {
  getAfterId,
  getAllOfChannel,
  getComments,
  postComment,
  postLikeStory,
  postStory,
  postUnlikeStory,
} from "../controllers/story.controller";

const storyRoute = Router();

storyRoute
  .all("/*", authenticationMiddleware)
  .get("/:channelId", validateSchema(getStoriesByChannelIdSchema, "params"), getAllOfChannel)
  .get("/:channelId/after/:storyId", validateSchema(getStoriesAfterIdSchema, "params"), getAfterId)
  .get("/:storyId/comments", validateSchema(allCommentsParamsSchema, "params"), getComments)
  .post("/", validateSchema(postStorySchema), postStory)
  .post("/:storyId/like", validateSchema(postLikeSchema, "params"), postLikeStory)
  .post("/:storyId/unlike", validateSchema(postLikeSchema, "params"), postUnlikeStory)
  .post(
    "/:storyId/comments",
    validateSchema(allCommentsParamsSchema, "params"),
    validateSchema(postCommentSchema),
    postComment,
  );

export { storyRoute };
