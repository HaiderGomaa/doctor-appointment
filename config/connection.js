import mongoose from "mongoose";

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.log("MONGO_URI is not set. Skipping MongoDB connection.");
    return false;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    return false;
  }
};

export default connectDB;