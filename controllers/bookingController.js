import asyncHandler from "express-async-handler";
import Booking from "../models/bookingModel.js";
import Customer from "../models/customerSchema.js";

// @desc    Create a booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = asyncHandler(async (req, res) => {
  const { clientName, phone, email, date, location, deposit, totalDue, notes } =
    req.body;

  // Validate required fields
  if (!clientName || !phone || !date || !totalDue || !deposit) {
    return res.status(400).json({
      success: false,
      message: "Client Name, Phone, Date, Total Due, and Deposit are required",
    });
  }

  // Find or create customer
  let customer = await Customer.findOne({ phone });

  if (!customer) {
    customer = await Customer.create({
      name: clientName,
      phone,
      email,
      user: req.user._id, 
    });
  }

  // Create the booking
  const booking = await Booking.create({
    clientName,
    phone,
    email,
    date,
    location,
    deposit,
    totalDue,
    notes,
    customer: customer._id,
    user: req.user._id, // Attach user ID to the booking
  });

  res.status(201).json({
    success: true,
    message: "Booking created successfully",
    data: booking,
  });
});
