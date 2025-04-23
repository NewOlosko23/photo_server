import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// @desc    Register a new user
// @route   POST /api/auth/register
export const registerUser = asyncHandler(async (req, res) => {
  const { studioName, email, password, phone, subscriptionType } = req.body;

  if (!studioName || !email || !password || !phone) {
    res.status(400);
    throw new Error("Please fill in all required fields");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error("User with this email already exists");
  }

  const user = await User.create({
    studioName,
    email,
    password,
    phone,
    subscriptionType,
    subscriptionDate: subscriptionType !== "basic" ? new Date() : null,
    subscribed: subscriptionType !== "basic",
  });

  res.status(201).json({
    _id: user._id,
    studioName: user.studioName,
    email: user.email,
    phone: user.phone,
    subscribed: user.subscribed,
    subscriptionType: user.subscriptionType,
    token: generateToken(user._id),
  });
});

// @desc    Login user
// @route   POST /api/auth/login
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  res.json({
    _id: user._id,
    studioName: user.studioName,
    email: user.email,
    phone: user.phone,
    subscribed: user.subscribed,
    subscriptionType: user.subscriptionType,
    token: generateToken(user._id),
  });
});

// Helper: Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};
