import { Router } from "express";
import { authenticationMiddleware, validateSchema } from "../middlewares";
import * as schema from "../schemas/user.schema";
import {
  getUserData,
  getUserDataByUserId,
  getUserResgiter,
  getUsersByUsername,
  getUserStories,
  getUserStoriesByUserId,
  postFollow,
  postUnfollow,
  putUser,
} from "../controllers/user.controller";

const userRoute = Router();

userRoute
  .all("/*", authenticationMiddleware)
  .get("/me", getUserData)
  .get("/me/stories", getUserStories)
  .get("/:username", getUsersByUsername)
  .get("/register/me", getUserResgiter)
  .get("/user/:userId", validateSchema(schema.allUserIdParams, "params"), getUserDataByUserId)
  .get("/:userId/stories", validateSchema(schema.allUserIdParams, "params"), getUserStoriesByUserId)
  .post("/:userId/follow", validateSchema(schema.allUserIdParams, "params"), postFollow)
  .post("/:userId/unfollow", validateSchema(schema.allUserIdParams, "params"), postUnfollow)
  .put("/:userId", validateSchema(schema.allUserIdParams, "params"), validateSchema(schema.putUserBody), putUser);

export { userRoute };
