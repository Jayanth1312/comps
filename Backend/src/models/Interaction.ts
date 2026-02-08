import mongoose, { Schema, Document } from "mongoose";

export interface IInteraction extends Document {
  userEmail: string;
  componentSlug: string;
  libraryName: string;
  type: "like" | "dislike";
  createdAt: Date;
}

const InteractionSchema: Schema = new Schema({
  userEmail: { type: String, required: true },
  componentSlug: { type: String, required: true },
  libraryName: { type: String, required: true },
  type: { type: String, enum: ["like", "dislike"], required: true },
  createdAt: { type: Date, default: Date.now },
});

// Unique interaction per user per component per library
InteractionSchema.index(
  { userEmail: 1, componentSlug: 1, libraryName: 1 },
  { unique: true },
);
// Index for aggregation
InteractionSchema.index({ componentSlug: 1, libraryName: 1 });

export default mongoose.model<IInteraction>("Interaction", InteractionSchema);
