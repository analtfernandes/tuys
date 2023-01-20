import express from "express";
import cors from "cors";
import { loadEnv } from "./config/env";

loadEnv();

const server = express();

server
  .use(express.json())
  .use(cors())
  .get("/status", (req, res) => res.send("It's alive!!!"));

export default server;
