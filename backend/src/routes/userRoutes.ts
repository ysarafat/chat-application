import { Router } from "express";
import { getUsers } from "../controller/userController";
import { protectRoute } from "../middleware/auth";

const router = Router();
router.get("/", protectRoute, getUsers);
export default router;
