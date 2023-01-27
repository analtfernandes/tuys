import { Router } from "express";
import { authenticationMiddleware } from "../middlewares/authentication.middleware";
import { validateSchema } from "../middlewares/validateSchema.middleware";
import * as schema from "../schemas/story.schemas";
import {
  deleteStory,
  getAfterId,
  getAllOfChannel,
  getComments,
  getFromUserAndFollowed,
  postComment,
  postDenounce,
  postLikeStory,
  postStory,
  postUnlikeStory,
  putStory,
} from "../controllers/story.controller";

const storyRoute = Router();

storyRoute
  .all("/*", authenticationMiddleware)
  .get("/", getFromUserAndFollowed)
  .get("/:channelId", validateSchema(schema.getByChannelId, "params"), getAllOfChannel)
  .get("/:channelId/after/:storyId", validateSchema(schema.getAfterId, "params"), getAfterId)
  .get("/:storyId/comments", validateSchema(schema.allCommentsParams, "params"), getComments)
  .post("/", validateSchema(schema.postNew), postStory)
  .post("/:storyId/like", validateSchema(schema.postLike, "params"), postLikeStory)
  .post("/:storyId/unlike", validateSchema(schema.postLike, "params"), postUnlikeStory)
  .post(
    "/:storyId/comments",
    validateSchema(schema.allCommentsParams, "params"),
    validateSchema(schema.postComment),
    postComment,
  )
  .post(
    "/:storyId/denounce",
    validateSchema(schema.postDenounceParams, "params"),
    validateSchema(schema.postDenounceBody),
    postDenounce,
  )
  .delete("/:storyId", validateSchema(schema.deleteParams, "params"), deleteStory)
  .put("/:storyId", validateSchema(schema.putParams, "params"), validateSchema(schema.putBody), putStory);

export { storyRoute };
