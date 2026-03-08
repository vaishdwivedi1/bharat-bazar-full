import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    sparse: true,
    index: true,
  },
  mobile: {
    type: String,
    sparse: true,
    index: true,
  },
  otp: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["email", "mobile"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // Automatically delete after 10 minutes
  },
});

// Ensure at least one of email or mobile is provided
otpSchema.pre("validate", function (next) {
  if (!this.email && !this.mobile) {
    next(new Error("Either email or mobile is required"));
  }
  next();
});

export const OTP = mongoose.model("OTP", otpSchema);
