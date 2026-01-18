import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI environment variable is not set");
  process.exit(1);
}
export const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log("Mongodb connected successfully");
  } catch (error) {
    console.error("Mongodb connection error:", error);
    process.exit(1);
  }
};
