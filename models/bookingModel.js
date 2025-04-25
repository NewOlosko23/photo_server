import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  date: { type: Date, required: true },
  location: { type: String },
  deposit: { type: Number, default: 0 },
  totalDue: { type: Number, required: true },
  notes: { type: String },
  status: { type: String, default: "pending" },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  createdAt: { type: Date, default: Date.now },
});

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
