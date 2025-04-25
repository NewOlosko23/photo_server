import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String },
  cloudinaryFolder: { type: String },
  imageStatus: {
    type: String,
    enum: ["raw", "review", "completed"],
    default: "raw",
  },
  jobStatus: {
    type: String,
    enum: ["incomplete", "complete", "defaulted"],
    default: "incomplete",
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  createdAt: { type: Date, default: Date.now },
});

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;
