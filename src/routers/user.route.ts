import { Router } from "express";
import { authenticationMiddleware } from "../middlewares/authentication.middleware";
import { getUserData } from "../controllers/user.controller";

const userRoute = Router();

userRoute.all("/*", authenticationMiddleware).get("/me", getUserData);

export { userRoute };
