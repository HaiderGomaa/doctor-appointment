import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "node:path";
import connectDB from "./config/connection.js";
import userRoutes from "./routes/user.js";
import doctorRoutes from "./routes/doctor.js";
import appointmentRoutes from "./routes/appoitment.js";
import departmentRoutes from "./routes/Depertments.js";

dotenv.config();

const app = express();

const startServer = async () => {
  const dbConnected = await connectDB();

  if (!dbConnected) {
    console.warn("MongoDB is not available. The server will still start, but database routes will fail until MongoDB is running.");
  }

  app.use(cors());
  app.use(express.json());
  app.use("/api/users", userRoutes);
  app.use("/api/doctors", doctorRoutes);
  app.use("/api/appointments", appointmentRoutes);
  app.use("/api/departments", departmentRoutes);
  app.use("/uploads", express.static(path.resolve("uploads")));

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();

