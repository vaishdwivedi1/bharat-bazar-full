import express from "express";
import {
  createAdmin,
  forgotPassword,
  registerBuyer,
  registerSeller,
  sendEmailOtp,
  sendMobileOtp,
  sendOtp,
  userLogin,
  verifyEmailOtp,
  verifyOtp,
  resetPassword,
  getSellers,
} from "../controllers/authController.js";
import { isAdmin, isValidToken } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

// Login routes
router.post("/v1/login", userLogin);

// Admin routes
// router.post("/admin/v1/createAdmin", createAdmin);
router.post("/admin/v1/createAdmin", isValidToken, isAdmin, createAdmin);

// Registration routes
router.post(
  "/seller/v1/registerSeller",
  upload.fields([
    { name: "panDoc", maxCount: 1 },
    { name: "addhaarDoc", maxCount: 1 },
  ]),
  registerSeller,
);
router.post("/user/v1/registerBuyer", registerBuyer);

// Password management
router.post("/v1/forgot-password", forgotPassword);
router.post("/v1/reset-password", resetPassword);

// OTP routes - Unified endpoints (recommended)
router.post("/v1/send-otp", sendOtp); // Sends OTP to email or mobile based on identifier
router.post("/v1/verify-otp", verifyOtp); // Verifies OTP for both email and mobile

// OTP routes - Specific endpoints (for backward compatibility)
router.post("/v1/send-email-otp", sendEmailOtp);
router.post("/v1/send-mobile-otp", sendMobileOtp);
router.post("/v1/verify-email-otp", verifyEmailOtp);

router.get("/public/sellers", getSellers);

export default router;
