import { type Document, model, Schema, Types } from "mongoose";

export interface IMessage extends Document {
  sender: Types.ObjectId;
  chat: Types.ObjectId;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    chat: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// indexing
MessageSchema.index({ chat: 1, createdAt: 1 });

export const Message = model<IMessage>("Message", MessageSchema);
