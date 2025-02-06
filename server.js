import "dotenv/config";

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
  USER_SEND_CHAT_EVENT,
  USER_TOGGLE_HIGHLIGHT_EVENT,
} from "./models/socket.js";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dev = process.env.NODE_ENV !== "production";
console.log("process.env.NODE_ENV ", process.env.NODE_ENV, { dev });
const hostname = "0.0.0.0";
const port = 3000;

const app = next({ dev, hostname, port, experimentalHttpsServer: true });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = (function () {
    if (dev) {
      const httpsOptions = {
        key: readFileSync(join(__dirname, ".ssl/localhost-key.pem")),
        cert: readFileSync(join(__dirname, ".ssl/localhost.pem")),
      };

      return createHttpsServer(httpsOptions, handler);
    }
    return createHttpServer(handler);
  })();

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("socket connected");

    socket.on(JOIN_ROOM_EVENT, (roomId, userId, additionalData) => {
      console.log(
        `a new user ${userId} joined room - ${roomId} - ${additionalData}`
      );
      socket.join(roomId); // Join the specified room
      socket.broadcast
        .to(roomId)
        .emit(USER_CONNECTED_EVENT, userId, additionalData); // Notify others in the room
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

    socket.on(USER_TOGGLE_HIGHLIGHT_EVENT, (userId, roomId) => {
      console.log(`user pin ${userId} - ${roomId}`);

      socket.join(roomId); // Join the room if not already joined
      socket.broadcast.to(roomId).emit(USER_TOGGLE_HIGHLIGHT_EVENT, userId); // Notify others in the room
    });

    socket.on(USER_SEND_CHAT_EVENT, (userId, roomId, message) => {
      console.log(`user send chat ${userId} - ${roomId} - ${message}`);

      socket.join(roomId); // Join the room if not already joined
      socket.broadcast.to(roomId).emit(USER_SEND_CHAT_EVENT, userId, message); // Notify others in the room
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
      console.log(`> Ready on ${dev ? 'https' : "http"}://${hostname}:${port}`);
    });
});
