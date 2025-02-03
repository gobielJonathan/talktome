import next from "next";
import { Server } from "socket.io";
import { createServer as createHttpsServer } from "node:https";
import { createServer as createHttpServer } from "node:http";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import {
  JOIN_ROOM_EVENT,
  USER_CONNECTED_EVENT,
  USER_LEAVE_EVENT,
  USER_TOGGLE_AUDIO_EVENT,
  USER_TOGGLE_VIDEO_EVENT,
} from "./models/socket.ts";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dev = process.env.NODE_ENV !== "production";
const hostname = "192.168.0.104";
const port = 3000;

const app = next({ dev, hostname, port, experimentalHttpsServer: true });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpsOptions = {
    key: readFileSync(join(__dirname, "certificates/localhost-key.pem")),
    cert: readFileSync(join(__dirname, "certificates/localhost.pem")),
  };

  const httpServer = dev
    ? createHttpsServer(httpsOptions, handler)
    : createHttpServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("socket connected");

    socket.on(JOIN_ROOM_EVENT, (roomId, userId) => {
      console.log(`a new user ${userId} joined room - ${roomId}`);
      socket.join(roomId); // Join the specified room
      socket.broadcast.to(roomId).emit(USER_CONNECTED_EVENT, userId); // Notify others in the room
    });

    socket.on(USER_TOGGLE_VIDEO_EVENT, (userId, roomId) => {
      console.log("user toggle video stream");

      socket.join(roomId); // Join the room if not already joined
      socket.broadcast.to(roomId).emit(USER_TOGGLE_VIDEO_EVENT, userId); // Notify others in the room
    });

    socket.on(USER_TOGGLE_AUDIO_EVENT, (userId, roomId) => {
      console.log("user toggle audio stream");

      socket.join(roomId); // Join the room if not already joined
      socket.broadcast.to(roomId).emit(USER_TOGGLE_AUDIO_EVENT, userId); // Notify others in the room
    });

    socket.on(USER_LEAVE_EVENT, (userId, roomId) => {
      console.log("user toggle audio stream");

      socket.join(roomId); // Join the room if not already joined
      socket.broadcast.to(roomId).emit(USER_LEAVE_EVENT, userId); // Notify others in the room
    });

    socket.on("disconnect", () => {
      console.log("socket disconnected");
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on https://${hostname}:${port}`);
    });
});
