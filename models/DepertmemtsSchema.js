import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100,
  },
  description: {
    type: String,
    default: "",
    trim: true,
    maxlength: 1000,
  },
  image: {
    type: String,
    default: "",
  },
});

const Department = mongoose.model("Department", departmentSchema);
export default Department;