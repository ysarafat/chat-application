import { Router } from "express";
import { getMessages } from "../controller/messageController";
import { protectRoute } from "../middleware/auth";

const router = Router();
router.get("/chat/:chatId", protectRoute, getMessages);
export default router;
