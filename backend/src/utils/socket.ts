import { verifyToken } from "@clerk/express";
import { Server as HttpServer } from "http";
import { Socket, Server as SocketServer } from "socket.io";
import { Chat } from "../model/Chat";
import { Message } from "../model/Message";
import { User } from "../model/User";

interface SocketWithUserId extends Socket {
  userId: string;
}
// store online user in memory
export const onlineUsers: Map<string, string> = new Map();

export const initializeSocket = (httpServer: HttpServer) => {
  const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:8081",
    process.env.PRODUCTION_URL!,
  ];

  const io = new SocketServer(httpServer, { cors: { origin: allowedOrigins } });

  // verify socket connection
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Authentication error"));
    try {
      const session = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY!,
      });
      const clerkId = session.sub;
      const user = await User.findOne({ clerkId });
      if (!user) return next(new Error("User not found"));
      (socket as SocketWithUserId).userId = user._id.toString();
      next();
    } catch (error: any) {
      next(new Error(error));
    }
  });

  io.on("connection", (socket) => {
    const userId = (socket as SocketWithUserId).userId;

    socket.emit("online-users", { userIds: Array.from(onlineUsers.keys()) });

    // set online user set
    onlineUsers.set(userId, socket.id);

    // notify others users
    socket.broadcast.emit("user_online", { userId: userId });

    socket.join(`user:${userId}`);

    socket.on("join-chat", (chatId: string) => {
      socket.join(`chat:${chatId}`);
    });

    // handle sending messages
    socket.on(
      "send-message",
      async (data: { chatId: string; text: string }) => {
        try {
          const { chatId, text } = data;
          const chat = await Chat.findOne({
            _id: chatId,
            participant: userId,
          });
          if (!chat) {
            socket.emit("socket-error", {
              message: "Chat not found",
            });
            return;
          }

          const message = await Message.create({
            chat: chatId,
            sender: userId,
            text,
          });

          chat.lastMessage = message._id;
          chat.lastMessageAt = new Date();

          await message.populate("sender", "name email avatar");

          io.to(`chat:${chatId}`).emit("new-message", message);

          for (const participantId of chat.participants) {
            io.to(`user:${participantId}`).emit("new-message", message);
          }
        } catch (error) {
          socket.emit("socket-error", { message: "Failed to send message" });
        }
      },
    );

    // TODO: LATER
    socket.on("typing", (data) => {});

    // disconnected user from chat
    socket.on("disconnect", () => {
      onlineUsers.delete(userId);

      socket.broadcast.emit("user-offline", { userId });
    });
  });
  return io;
};
