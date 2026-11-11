import express from "express";
import multer from "multer";
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

const upload = multer({ storage });

router.post("/addDoctors", authenticateToken("admin"), upload.single("image"), async (req, res) => {
  try {
    const { name, specialty, description, experienceYear } = req.body;
    const imagePath = req.file ? req.file.filename : null;

    if (!name || !specialty || !imagePath || !description || !experienceYear) {
      return res.status(400).json({ error: "Please provide all required fields" });
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
