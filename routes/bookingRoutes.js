import express from "express";
import { createBooking } from "../controllers/bookingController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createBooking);
//router.get("/", getAllBookings);
//router.get("/customer/:customerId", getBookingsByCustomer);
//router.put("/:id", updateBooking);
//router.delete("/:id", deleteBooking);

export default router;
