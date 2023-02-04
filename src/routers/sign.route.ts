import { Router } from "express";
import * as schema from "../schemas/sign.schemas";
import { authenticationMiddleware, validateSchema } from "../middlewares";
import { postSignIn, postSignOut, postSignUp } from "../controllers/sign.controller";

const signRoute = Router();

signRoute
  .post("/sign-up", validateSchema(schema.postSignUp), postSignUp)
  .post("/sign-in", validateSchema(schema.postSignIn), postSignIn)
  .post("/sign-out", authenticationMiddleware, postSignOut);

export { signRoute };
