import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Server } from "socket.io";

import userRouter from "./routes/userRoutes.mjs";
import msgRouter from "./routes/messagesRoute.mjs";

dotenv.config();

try {
  mongoose.connect("mongodb://0.0.0.0/chat");
} catch (error) {
  console.log(error);
}

const app = express();
app.use(
  cors({
    allowedHeaders: "*",
  })
);
app.use(express.json());

app.use("/api/auth", userRouter);
app.use("/api/messages", msgRouter);

const server = app.listen(5000, () => {
  // console.log(`Server started at port ${server.address().port}`);
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  // console.log("user connected", socket.id);
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });
  socket.on("send-msg", (data) => {
    const sendUSerSocket = onlineUsers.get(data.to);
    if (sendUSerSocket) {
      socket.to(sendUSerSocket).emit("msg-recieve", data);
    } else {
      console.log("error getting user");
    }
  });
});
