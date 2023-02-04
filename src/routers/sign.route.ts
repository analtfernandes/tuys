import { Router } from "express";
import * as schema from "../schemas/sign.schemas";
import { validateSchema } from "../middlewares";
import { postSignIn, postSignUp } from "../controllers/sign.controller";

const signRoute = Router();

signRoute
  .post("/sign-up", validateSchema(schema.postSignUp), postSignUp)
  .post("/sign-in", validateSchema(schema.postSignIn), postSignIn);

export { signRoute };
