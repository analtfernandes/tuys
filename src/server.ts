import express from "express";
import cors from "cors";
import { loadEnv } from "./config/env";
import { channelRoute, notificationRoute, rankingRoute, storyRoute, userRoute } from "./routers";

loadEnv();

const server = express();

server
  .use(express.json())
  .use(cors())
  .get("/status", (req, res) => res.send("It's alive!!!"))
  .use("/channels", channelRoute)
  .use("/stories", storyRoute)
  .use("/users", userRoute)
  .use("/ranking", rankingRoute)
  .use("/notifications", notificationRoute);

export default server;
