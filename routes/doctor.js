import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import Doctor from "../models/DoctorSchema.js";
import authenticateToken from "../auth/middleware.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    if (!file.mimetype.startsWith("image/")) {
      callback(new Error("Profile photo must be an image"));
      return;
    }
    callback(null, true);
  },
});
const uploadDoctorImage = (req, res, next) => {
  upload.single("image")(req, res, (error) => {
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    next();
  });
};

router.post("/addDoctors", authenticateToken("admin"), uploadDoctorImage, async (req, res) => {
  try {
    const { name: rawName, specialty: rawSpecialty, description: rawDescription, experienceYear: rawExperienceYear } = req.body || {};
    const name = typeof rawName === "string" ? rawName.trim() : "";
    const specialty = typeof rawSpecialty === "string" ? rawSpecialty.trim() : "";
    const description = typeof rawDescription === "string" ? rawDescription.trim() : "";
    const experienceYear =
      rawExperienceYear === "" || rawExperienceYear == null
        ? Number.NaN
        : Number(rawExperienceYear);
    const imagePath = req.file ? req.file.filename : null;

    if (name.length < 2 || name.length > 100) {
      return res.status(400).json({ error: "Doctor name must be between 2 and 100 characters" });
    }
    if (specialty.length < 2 || specialty.length > 100) {
      return res.status(400).json({ error: "Specialty must be between 2 and 100 characters" });
    }
    if (!imagePath) {
      return res.status(400).json({ error: "Please provide a profile photo" });
    }
    if (description.length < 5 || description.length > 2000) {
      return res.status(400).json({ error: "Description must be between 5 and 2000 characters" });
    }
    if (!Number.isInteger(experienceYear) || experienceYear < 0) {
      return res.status(400).json({ error: "Experience must be a non-negative whole number" });
    }

    const newDoctor = await Doctor.create({
      name,
      specialty,
      image: imagePath,
      description,
      experienceYear,
    });

    res.status(201).json({ message: "Doctor created successfully", doctor: newDoctor });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
//6af1c67633f85426a0cecc2d
router.get("/getDoctors", async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/countDoctors", async (req, res) => {
  try {
    const count = await Doctor.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: "Please provide a valid doctor ID" });
  }

  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
