import express from "express";
import cors from "cors";
import { groupRouter } from "./Controller/meetingController";

const server = express();

server.use(express.json());
server.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5175","http://localhost:5176"],
  })
);

server.use(groupRouter);

server.get("/health", (_req, res) => res.json({ ok: true }));

server.listen(3002, "0.0.0.0", () => {
  console.log("Listening on http://localhost:3002");
});
