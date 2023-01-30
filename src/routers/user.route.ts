import { Router } from "express";
import { authenticationMiddleware } from "../middlewares/authentication.middleware";
import { getUserData, getUsersByUsername, getUserStories } from "../controllers/user.controller";

const userRoute = Router();

userRoute
  .all("/*", authenticationMiddleware)
  .get("/me", getUserData)
  .get("/me/stories", getUserStories)
  .get("/:username", getUsersByUsername);

export { userRoute };
