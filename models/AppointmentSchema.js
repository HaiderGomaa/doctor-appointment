import mongoose from "mongoose";
const AppointmentSchema = new mongoose.Schema({
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    reason: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 1000
    }
});
const Appointment = mongoose.model("Appointment", AppointmentSchema);
export default Appointment;