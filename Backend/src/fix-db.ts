import mongoose from "mongoose";
import dotenv from "dotenv";
import Interaction from "./models/Interaction";

dotenv.config();

async function fixDb() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error("MONGODB_URI not found");
    return;
  }

  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB.");

  const db = mongoose.connection.db;
  if (!db) {
    console.error("No DB connection");
    return;
  }

  const collectionName = "interactions";
  const collections = await db
    .listCollections({ name: collectionName })
    .toArray();

  if (collections.length > 0) {
    console.log(`Checking indexes for '${collectionName}'...`);
    const indexes = await db.collection(collectionName).indexes();
    console.log("Current indexes:", JSON.stringify(indexes, null, 2));

    // Check for old targetId index
    const hasOldIndex = indexes.some((idx) => idx.key.targetId);
    if (hasOldIndex) {
      console.log("Found old targetId index. Dropping it...");
      try {
        await db.collection(collectionName).dropIndex("userEmail_1_targetId_1");
        console.log("Dropped old unique index.");
      } catch (e) {
        console.warn("TargetId index drop failed (might have different name).");
      }
    }

    // Drop all and recreate to be safe since we changed schema
    console.log("Dropping interaction collection to clear schema mismatch...");
    await db.collection(collectionName).drop();
    console.log("Dropped interactions collection.");
  } else {
    console.log("Interactions collection does not exist.");
  }

  // Same for Favorites if needed, but Favorites hasn't changed its schema as much
  // but let's check it too.
  console.log("Syncing indexes...");
  await Interaction.createIndexes();
  console.log("Indexes created.");

  await mongoose.disconnect();
  console.log("Done.");
}

fixDb().catch(console.error);
