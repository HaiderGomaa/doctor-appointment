import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/UserSchema.js";
import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcryptjs";
import { isValidEmail, normalizeEmail } from "../utils/validation.js";
const router = express.Router();

// @route   GET /api/users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   POST /api/users
router.post("/register", async (req, res) => {
  const { name: rawName, email: rawEmail, password } = req.body || {};
  const name = typeof rawName === "string" ? rawName.trim() : "";
  const email =
    typeof rawEmail === "string" ? normalizeEmail(rawEmail) : "";

  if (name.length < 2 || name.length > 100) {
    return res.status(400).json({ error: "Name must be between 2 and 100 characters" });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Please provide a valid email address" });
  }
  if (typeof password !== "string" || password.length < 8 || password.length > 72) {
    return res.status(400).json({ error: "Password must be between 8 and 72 characters" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });
    const token = jwt.sign({ email, id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, {
      expiresIn: "1w",
    });

    res.status(201).json({ message: "User registered successfully", token, user:{
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/signin", async (req, res) => {
  const { email: rawEmail, password } = req.body || {};
  const email =
    typeof rawEmail === "string" ? normalizeEmail(rawEmail) : "";

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Please provide a valid email address" });
  }
  if (typeof password !== "string" || password.length === 0 || password.length > 72) {
    return res.status(400).json({ error: "Please provide a valid password" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ email, id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1w",
    });

    res.json({ message: "Login successful", token, user:{
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
