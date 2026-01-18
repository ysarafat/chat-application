import { Router } from "express";
import { getChats, getOrCreateChat } from "../controller/chatController";
import { protectRoute } from "../middleware/auth";

const router = Router();
router.use(protectRoute);

router.get("/", getChats);
router.post("/with/:participantId", getOrCreateChat);

export default router;
