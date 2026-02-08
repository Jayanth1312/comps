import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function checkDocs() {
  await mongoose.connect(process.env.MONGODB_URI!);
  const db = mongoose.connection.db;
  if (!db) return;

  const docs = await db.collection("interactions").find({}).toArray();
  console.log("Interactions count:", docs.length);
  console.log("Docs sampled:", JSON.stringify(docs.slice(0, 3), null, 2));

  await mongoose.disconnect();
}

checkDocs();
