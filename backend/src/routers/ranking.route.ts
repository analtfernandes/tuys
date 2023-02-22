import { Router } from "express";
import { authenticationMiddleware } from "../middlewares";
import { getRanking } from "../controllers/ranking.controller";

const rankingRoute = Router();

rankingRoute.all("/*", authenticationMiddleware({})).get("/", getRanking);

export { rankingRoute };
