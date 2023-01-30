import { Router } from "express";
import { authenticationMiddleware, validateSchema } from "../middlewares";
import * as schema from "../schemas/user.schema";
import {
  getUserData,
  getUserDataByUserId,
  getUsersByUsername,
  getUserStories,
  getUserStoriesByUserId,
  postFollow,
} from "../controllers/user.controller";

const userRoute = Router();

userRoute
  .all("/*", authenticationMiddleware)
  .get("/me", getUserData)
  .get("/me/stories", getUserStories)
  .get("/:username", getUsersByUsername)
  .get("/user/:userId", validateSchema(schema.allUserIdParams, "params"), getUserDataByUserId)
  .get("/:userId/stories", validateSchema(schema.allUserIdParams, "params"), getUserStoriesByUserId)
  .post("/:userId/follow", validateSchema(schema.allUserIdParams, "params"), postFollow);

export { userRoute };
