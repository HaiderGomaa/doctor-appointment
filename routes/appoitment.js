import express from "express";
import Appointment from "../models/AppointmentSchema.js";
import authenticateToken from "../auth/middleware.js";

const router = express.Router();

router.post("/bookAppointment", authenticateToken(), async (req, res) => {
  const { doctor, date, reason } = req.body;
  const user = req.user?.id;

  if (!doctor || !user || !date || !reason) {
    return res.status(400).json({ error: "Please provide all required fields" });
  }

  try {
    const appointment = await Appointment.create({ doctor, user, date, reason });
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

  if (!id) {
    return res.status(400).json({ error: "Please provide the appointment ID" });
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
