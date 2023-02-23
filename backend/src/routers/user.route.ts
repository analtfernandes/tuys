import { Router } from "express";
import { authenticationMiddleware, validateAdminRankMiddleware, validateSchema } from "../middlewares";
import * as schema from "../schemas/user.schema";
import {
  getUserData,
  getUserDataByUserId,
  getUserFollowers,
  getUserResgiter,
  getUsersByUsername,
  getUserStories,
  getUserStoriesByUserId,
  getWhoUserIsFollowing,
  postFollow,
  postUnban,
  postUnfollow,
  putUser,
} from "../controllers/user.controller";

const userRoute = Router();

userRoute
  .all("/*", authenticationMiddleware({ validateUserStatus: true }))
  .get("/me", getUserData)
  .get("/me/stories", getUserStories)
  .get("/me/followers", getUserFollowers)
  .get("/me/following", getWhoUserIsFollowing)
  .get("/:username", getUsersByUsername)
  .get("/register/me", getUserResgiter)
  .get("/user/:userId", validateSchema(schema.allUserIdParams, "params"), getUserDataByUserId)
  .get("/:userId/stories", validateSchema(schema.allUserIdParams, "params"), getUserStoriesByUserId)
  .get("/:userId/followers", validateSchema(schema.allUserIdParams, "params"), getUserFollowers)
  .get("/:userId/following", validateSchema(schema.allUserIdParams, "params"), getWhoUserIsFollowing)
  .post("/:userId/follow", validateSchema(schema.allUserIdParams, "params"), postFollow)
  .post("/:userId/unfollow", validateSchema(schema.allUserIdParams, "params"), postUnfollow)
  .post("/:userId/unban", validateSchema(schema.allUserIdParams, "params"), validateAdminRankMiddleware, postUnban)
  .put("/:userId", validateSchema(schema.allUserIdParams, "params"), validateSchema(schema.putUserBody), putUser);

export { userRoute };
