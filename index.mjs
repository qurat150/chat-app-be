import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/userRoutes.mjs";
import msgRouter from "./routes/messagesRoute.mjs";
import { Server } from "socket.io";

dotenv.config();

try {
  mongoose.connect("mongodb://0.0.0.0/chat");
  console.log("mongodb connected");
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

app.use((req, res, next) => {
  console.log(req.url, req.method);
  next();
});

app.use("/api/auth", userRouter);
app.use("/api/messages", msgRouter);

const server = app.listen(5000, () => {
  console.log(`Server started at port ${server.address().port}`);
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  console.log("user connected", socket.id);
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });
  socket.on("send-msg", (data) => {
    console.log("message", data);

    const sendUSerSocket = onlineUsers.get(data.to);
    if (sendUSerSocket) {
      console.log("sending message", data.message, sendUSerSocket);

      socket.to(sendUSerSocket).emit("msg-recieve", data);
    } else {
      console.log("error getting user");
    }
  });
});
