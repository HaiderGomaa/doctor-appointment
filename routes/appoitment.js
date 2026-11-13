import express from "express";
import mongoose from "mongoose";
import Appointment from "../models/AppointmentSchema.js";
import Doctor from "../models/DoctorSchema.js";
import authenticateToken from "../auth/middleware.js";

const router = express.Router();

router.post("/bookAppointment", authenticateToken(), async (req, res) => {
  const { doctor, date, reason: rawReason } = req.body || {};
  const reason = typeof rawReason === "string" ? rawReason.trim() : "";
  const user = req.user?.id;

  if (!user || !mongoose.isValidObjectId(user)) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (!mongoose.isValidObjectId(doctor)) {
    return res.status(400).json({ error: "Please select a valid doctor" });
  }
  const appointmentDate = typeof date === "string" ? new Date(date) : null;
  if (!appointmentDate || Number.isNaN(appointmentDate.getTime()) || appointmentDate <= new Date()) {
    return res.status(400).json({ error: "Appointment date must be in the future" });
  }
  if (reason.length < 5 || reason.length > 1000) {
    return res.status(400).json({ error: "Reason must be between 5 and 1000 characters" });
  }

  try {
    const doctorExists = await Doctor.exists({ _id: doctor });
    if (!doctorExists) {
      return res.status(400).json({ error: "The selected doctor does not exist" });
    }

    const appointment = await Appointment.create({
      doctor,
      user,
      date: appointmentDate,
      reason,
    });
    return res.status(201).json({ message: "Appointment booked successfully", appointment });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/getAppointments", authenticateToken(), async (req, res) => {
  const user = req.user?.id;

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const appointments = await Appointment.find({ user }).populate("doctor", "name specialty");
    return res.json(appointments);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/cancelAppointment/:id", authenticateToken(), async (req, res) => {
  const { id } = req.params;
  const user = req.user?.id;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: "Please provide a valid appointment ID" });
  }

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const appointment = await Appointment.findOneAndDelete({ _id: id, user });

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    return res.json({ message: "Appointment cancelled successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
