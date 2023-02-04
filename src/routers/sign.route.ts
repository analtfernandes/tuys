import { Router } from "express";
import * as schema from "../schemas/sign.schemas";
import { authenticationMiddleware, validateSchema } from "../middlewares";
import { postSignIn, postSignOut, postSignUp, postSignWithGoogle } from "../controllers/sign.controller";

const signRoute = Router();

signRoute
  .post("/sign-up", validateSchema(schema.postSignUp), postSignUp)
  .post("/sign-in", validateSchema(schema.postSignIn), postSignIn)
  .post("/sign/method/google", validateSchema(schema.postSignWithGoogle), postSignWithGoogle)
  .post("/sign-out", authenticationMiddleware, postSignOut);

export { signRoute };
