import express, { type Application } from "express";
import authRoutes from "./routes/authRoutes";
import chatRoutes from "./routes/chatRoutes";
import messageRoutes from "./routes/messageRoutes";
import userRoutes from "./routes/userRoutes";

const app: Application = express();

// default middleware
app.use(express.json());

// routes
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running." });
});
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);

export default app;
