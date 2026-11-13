import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import Deprtments from "../models/DepertmemtsSchema.js";
import authenticateToken from "../auth/middleware.js";
const router = express.Router();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    }
    ,
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, callback) => {
        if (!file.mimetype.startsWith("image/")) {
            callback(new Error("Department image must be an image"));
            return;
        }
        callback(null, true);
    }
});
const uploadDepartmentImage = (req, res, next) => {
    upload.single("image")(req, res, (error) => {
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        next();
    });
};
router.post("/addDepertments", authenticateToken("admin"), uploadDepartmentImage, async (req, res) => {
    try {
        const { name: rawName, description: rawDescription } = req.body || {};
        const name = typeof rawName === "string" ? rawName.trim() : "";
        const description = typeof rawDescription === "string" ? rawDescription.trim() : "";
        const imagePath = req.file ? req.file.filename : "";
        if (name.length < 2 || name.length > 100) {
            return res.status(400).json({ error: "Department name must be between 2 and 100 characters" });
        }
        if (description.length > 1000) {
            return res.status(400).json({ error: "Description cannot exceed 1000 characters" });
        }
        const newDepertment = await Deprtments.create({
            name,
            image: imagePath,
            description
        });
        res.status(201).json({ message: "Depertment created successfully", depertment: newDepertment });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.get("/getDepertments", async (req, res) => {
    try {
        const depertments = await Deprtments.find();
        res.json(depertments);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/countDepertments", async (req, res) => {
    try {
        const count = await Deprtments.countDocuments();
        res.json({ count });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.get("/:id", authenticateToken, async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ error: "Please provide a valid department ID" });
    }
    try {
        const depertment = await Deprtments.findById(req.params.id);
        if (!depertment) {
            return res.status(404).json({ error: "Depertment not found" });
        }
        res.json(depertment);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.delete("/deleteDepertment/:id", authenticateToken, async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ error: "Please provide a valid department ID" });
    }
    try {
        const depertment = await Deprtments.findByIdAndDelete(req.params.id);
        if (!depertment) {
            return res.status(404).json({ error: "Depertment not found" });
        }
        res.json({ message: "Depertment deleted successfully" });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
export default router;