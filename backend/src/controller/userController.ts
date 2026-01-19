import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../middleware/auth";
import { User } from "../model/User";

// get users
export async function getUsers(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  console.log("USER Route hit");
  try {
    const userId = req.userId;
    const users = await User.find({ _id: { $ne: userId } })
      .select("name email avatar")
      .limit(50);

    res.status(200).json(users);
  } catch (error) {
    res.status(500);
    next(error);
  }
}
