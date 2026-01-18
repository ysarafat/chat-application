import { Router } from "express";
import { authCallback, getMe } from "../controller/authController";
import { protectRoute } from "../middleware/auth";

const router = Router();
// get me route
router.get("/me", protectRoute, getMe);
router.get("/callback", authCallback);
export default router;
