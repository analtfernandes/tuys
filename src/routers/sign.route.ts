import { Router } from "express";
import * as schema from "../schemas/sign.schemas";
import { validateSchema } from "../middlewares";
import { postSignUp } from "../controllers/sign.controller";

const signRoute = Router();

signRoute.post("/sign-up", validateSchema(schema.postSignUp), postSignUp);

export { signRoute };
