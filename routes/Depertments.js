import express from "express";
import multer from "multer";
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
const upload = multer({ storage });
router.post("/addDepertments", authenticateToken("admin"), upload.single("image"), async (req, res) => {
    try {
        const { name, description } = req.body;
        const imagePath = req.file ? req.file.filename : null;
        if (!name ) {
            return res.status(400).json({ error: "Please provide all required fields" });
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