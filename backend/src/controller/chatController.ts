import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../middleware/auth";
import { Chat } from "../model/Chat";

// get chat
export async function getChats(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.userId;

    const chats = await Chat.find({
      participants: userId,
    })
      .populate("participants", "name email avatar")
      .populate("lastMessage")
      .sort({ createdAt: 1 });

    const formattedChats = chats.map((chat) => {
      const otherParticipants = chat.participants.find(
        (p) => p._id.toString() !== userId,
      );
      return {
        _id: chat._id,
        participant: otherParticipants,
        lastMessage: chat.lastMessage,
        lastMessageAt: chat.lastMessageAt,
        createdAt: chat.createdAt,
      };
    });
    res.status(200).json(formattedChats);
  } catch (error) {
    res.status(500);
    next(error);
  }
}

// get chats or create chats
export async function getOrCreateChat(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.userId;
    const { participantId } = req.params;

    let chat = await Chat.findOne({
      participants: { $all: [userId, participantId] },
    })
      .populate("participants", "name email avatar")
      .populate("lastMessage");

    if (!chat) {
      const newChat = new Chat({ participants: [userId, participantId] });
      await newChat.save();
      chat = await newChat.populate("participants", "name email avatar");
    }
    const otherParticipant = chat.participants.find(
      (p) => p._id.toString() !== userId,
    );
    res.status(200).json({
      _id: chat._id,
      participant: otherParticipant ?? null,
      lastMessage: chat.lastMessage,
      lastMessageAt: chat.lastMessageAt,
      createdAt: chat.createdAt,
    });
  } catch (error) {
    res.status(500);
    next(error);
  }
}
