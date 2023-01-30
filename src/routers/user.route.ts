import { Router } from "express";
import { authenticationMiddleware } from "../middlewares/authentication.middleware";
import {
  getUserData,
  getUserDataByUserId,
  getUsersByUsername,
  getUserStories,
  getUserStoriesByUserId,
} from "../controllers/user.controller";

const userRoute = Router();

userRoute
  .all("/*", authenticationMiddleware)
  .get("/me", getUserData)
  .get("/me/stories", getUserStories)
  .get("/:username", getUsersByUsername)
  .get("/user/:userId", getUserDataByUserId)
  .get("/:userId/stories", getUserStoriesByUserId);

export { userRoute };
