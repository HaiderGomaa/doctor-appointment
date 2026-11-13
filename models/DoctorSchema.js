import mongoose from "mongoose";
const DoctorSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    specialty: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    image: { type: String, required: true },
    description: { type: String, required: true, trim: true, minlength: 5, maxlength: 2000 },
    experienceYear: {
        type: Number,
        required: true,
        min: 0,
        validate: Number.isInteger,
    },

})  
const Doctor = mongoose.model("Doctor", DoctorSchema);
export default Doctor;
