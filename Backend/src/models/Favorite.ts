import mongoose, { Schema, Document } from "mongoose";

export interface IFavorite extends Document {
  userEmail: string;
  targetId: string; // e.g., 'button'
  createdAt: Date;
}

const FavoriteSchema: Schema = new Schema({
  userEmail: { type: String, required: true },
  targetId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Unique index: one favorite per user per target
FavoriteSchema.index({ userEmail: 1, targetId: 1 }, { unique: true });

export default mongoose.model<IFavorite>("Favorite", FavoriteSchema);
