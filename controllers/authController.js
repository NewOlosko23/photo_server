import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// Helper: Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// @desc    Register a new user
// @route   POST /api/auth/register
export const registerUser = asyncHandler(async (req, res) => {
  const { studioName, email, password, phone, subscriptionType } = req.body;

  if (!studioName || !email || !password || !phone) {
    return res.status(400).json({
      success: false,
      message: "Please fill in all required fields",
    });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "User with this email already exists",
    });
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

  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      _id: user._id,
      studioName: user.studioName,
      email: user.email,
      phone: user.phone,
      subscribed: user.subscribed,
      subscriptionType: user.subscriptionType,
      token: generateToken(user._id),
    },
  });
});

// @desc    Login user
// @route   POST /api/auth/login
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide email and password",
    });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      _id: user._id,
      studioName: user.studioName,
      email: user.email,
      phone: user.phone,
      subscribed: user.subscribed,
      subscriptionType: user.subscriptionType,
      token: generateToken(user._id),
    },
  });
});
