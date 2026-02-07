import mongoose, { Schema, Document } from "mongoose";

export interface IMessage {
  role: "user" | "ai";
  content: string;
  type: "text" | "code";
  codeVariants?: Array<{
    library: string;
    code: string;
    language?: string;
  }>;
  images?: string[];
  timestamp: Date;
}

export interface IChatSession extends Document {
  userId: mongoose.Types.ObjectId;
  chatSessionId: string;
  title: string;
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  role: { type: String, enum: ["user", "ai"], required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ["text", "code"], required: true },
  codeVariants: [
    {
      library: String,
      code: String,
      language: String,
    },
  ],
  images: [String],
  timestamp: { type: Date, default: Date.now },
});

const ChatSessionSchema = new Schema<IChatSession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    chatSessionId: { type: String, required: true, unique: true },
    title: { type: String, default: "New Chat" },
    messages: [MessageSchema],
  },
  { timestamps: true },
);

// Index for faster history retrieval by user
ChatSessionSchema.index({ userId: 1, updatedAt: -1 });

export const ChatSession = mongoose.model<IChatSession>(
  "ChatSession",
  ChatSessionSchema,
);
