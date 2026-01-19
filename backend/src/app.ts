import { clerkMiddleware } from "@clerk/express";
import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import path from "path";
import { errorHandler } from "./middleware/errorHandler";
import authRoutes from "./routes/authRoutes";
import chatRoutes from "./routes/chatRoutes";
import messageRoutes from "./routes/messageRoutes";
import userRoutes from "./routes/userRoutes";

const app: Application = express();

// default middleware
app.use(express.json());
app.use(clerkMiddleware());

// routes
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running." });
});
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);

// default error handler
app.use(errorHandler);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../web/dist")));

  app.get("/{*any}", (_: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "../../web/dist/index.html"));
  });
}
export default app;
